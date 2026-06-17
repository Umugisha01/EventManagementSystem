using Microsoft.EntityFrameworkCore;
using RwandaEventHub.Data;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;
using Microsoft.AspNetCore.Http;
using ClosedXML.Excel;

namespace RwandaEventHub.Services;

public class VenueService : IVenueService
{
    private readonly AppDbContext _context;

    public VenueService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<IEnumerable<Venue>>> GetAllVenuesAsync()
    {
        var venues = await _context.Venues.OrderByDescending(v => v.CreatedAt).ToListAsync();
        return ApiResponse<IEnumerable<Venue>>.Ok(venues);
    }

    public async Task<ApiResponse<Venue>> GetVenueByIdAsync(int id)
    {
        var venue = await _context.Venues.Include(v => v.Seats).FirstOrDefaultAsync(v => v.Id == id);
        if (venue == null) return ApiResponse<Venue>.NotFound("Venue was not found in the database.");
        return ApiResponse<Venue>.Ok(venue);
    }

    public async Task<ApiResponse<Venue>> CreateVenueAsync(Venue venue)
    {
        _context.Venues.Add(venue);
        await _context.SaveChangesAsync();
        return ApiResponse<Venue>.Created(venue);
    }

    public async Task<ApiResponse<Venue>> UpdateVenueAsync(int id, Venue venue)
    {
        var existing = await _context.Venues.FindAsync(id);
        if (existing == null) return ApiResponse<Venue>.NotFound();

        existing.Name = venue.Name;
        existing.Address = venue.Address;
        existing.Capacity = venue.Capacity;
        existing.Type = venue.Type;

        await _context.SaveChangesAsync();
        return ApiResponse<Venue>.Ok(existing);
    }

    public async Task<ApiResponse<bool>> DeleteVenueAsync(int id)
    {
        var venue = await _context.Venues.FindAsync(id);
        if (venue == null) return ApiResponse<bool>.NotFound();

        _context.Venues.Remove(venue);
        await _context.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true);
    }

    public async Task<ApiResponse<int>> ImportSeatsFromExcelAsync(int venueId, IFormFile file)
    {
        var venue = await _context.Venues.FindAsync(venueId);
        if (venue == null) return ApiResponse<int>.Fail("Target venue does not exist.");

        if (file == null || file.Length == 0) return ApiResponse<int>.Fail("Please upload a valid Excel (.xlsx) file.");

        try 
        {
            using var stream = file.OpenReadStream();
            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheets.FirstOrDefault();
            
            if (worksheet == null) return ApiResponse<int>.Fail("The Excel file has no worksheets.");

            // Find data start (Skip columns header)
            var rows = worksheet.RangeUsed().RowsUsed();
            if (rows.Count() <= 1) return ApiResponse<int>.Fail("The Excel file appears to be empty or missing data rows.");

            var seatList = new List<Seat>();
            var seenSeats = new HashSet<string>(); // For duplicate detection within the file

            // Start from Row 2 or first data row
            foreach (var row in rows.Skip(1))
            {
                var rowNum = row.RowNumber();
                try 
                {
                    string section = row.Cell(1).GetValue<string>()?.Trim() ?? "Main";
                    string rowVal = row.Cell(2).GetValue<string>()?.Trim() ?? "";
                    string seatNo = row.Cell(3).GetValue<string>()?.Trim() ?? "";
                    string category = row.Cell(4).GetValue<string>()?.Trim() ?? "Regular";

                    if (string.IsNullOrEmpty(seatNo)) continue;

                    // Section + Row + Seat makes it bulletproof
                    string uniqueKey = $"{section}-{rowVal}-{seatNo}"; 

                    if (seenSeats.Contains(uniqueKey)) continue;

                    seatList.Add(new Seat
                    {
                        VenueId = venueId,
                        // If Section exists, we can prefix it or just store Row/No
                        SeatNumber = seatNo,
                        Row = $"{section} {rowVal}".Trim(),
                        Class = string.IsNullOrEmpty(category) ? "Regular" : category,
                        Status = "Available"
                    });

                    seenSeats.Add(uniqueKey);
                }
                catch (Exception ex)
                {
                    // Log or handle individual row error
                    Console.WriteLine($"Error at row {rowNum}: {ex.Message}");
                }
            }

            if (!seatList.Any()) return ApiResponse<int>.Fail("No valid seats were found in the Excel mapping.");

            // Database Operations in Transaction
            using var transaction = await _context.Database.BeginTransactionAsync();
            try 
            {
                // FORCE UPDATE the Row column size in the database if it's still small
                await _context.Database.ExecuteSqlRawAsync("ALTER TABLE Seats ALTER COLUMN Row NVARCHAR(50)");

                // 1. Remove old seats
                var oldSeats = _context.Seats.Where(s => s.VenueId == venueId);
                _context.Seats.RemoveRange(oldSeats);

                // 2. Add new seats
                await _context.Seats.AddRangeAsync(seatList);

                // 3. Update Venue Capacity
                venue.Capacity = seatList.Count;
                
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return ApiResponse<int>.Ok(seatList.Count, $"Successfully imported {seatList.Count} seats for {venue.Name}.");
            }
            catch (Exception dbEx)
            {
                await transaction.RollbackAsync();
                return ApiResponse<int>.Fail("Database Error: " + dbEx.InnerException?.Message ?? dbEx.Message);
            }
        }
        catch (Exception ex)
        {
            return ApiResponse<int>.Fail("Excel Processing Error: " + ex.Message);
        }
    }
}
