using Microsoft.EntityFrameworkCore;
using RwandaEventHub.Data;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;
using RwandaEventHub.Constants;

namespace RwandaEventHub.Services;

public class VerifyService : IVerifyService
{
    private readonly AppDbContext _context;

    public VerifyService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<CheckInLog>> VerifyTicketAsync(string qrCode, string staffId)
    {
        if (!int.TryParse(staffId, out int sId)) return ApiResponse<CheckInLog>.Fail("Invalid staff id");

        // Prepare lookup code (strip "REH-" but leave the rest for QRTicketCode matching)
        string lookupCode = qrCode.Trim();
        string cleanId = lookupCode;
        if (lookupCode.StartsWith("REH-", StringComparison.OrdinalIgnoreCase))
        {
            // If it's REH-5-102, cleanId for the integer Id check should be the last part
            var parts = lookupCode.Split('-');
            cleanId = parts[parts.Length - 1]; 
        }

        // 1. Check if ticket exists
        var booking = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Seat)
            .Include(b => b.Event)
            .FirstOrDefaultAsync(b => b.QRTicketCode == lookupCode || b.Id.ToString() == cleanId);
            
        if (booking == null)
        {
            return await LogAndReturn(null, sId, 0, AppConstants.CheckInResult.InvalidTicket, "Ticket not found");
        }

        // 2. Check if already scanned
        if (booking.BookingStatus == AppConstants.BookingStatus.CheckedIn)
        {
             return await LogAndReturn(booking.Id, sId, booking.EventId, AppConstants.CheckInResult.AlreadyScanned, "Ticket already used");
        }

        // 3. Check if staff is assigned to this event
        var isAssigned = await _context.StaffAssignments.AnyAsync(sa => sa.StaffId == sId && sa.EventId == booking.EventId && sa.IsActive);
        if (!isAssigned)
        {
            return await LogAndReturn(booking.Id, sId, booking.EventId, AppConstants.CheckInResult.WrongEvent, "Staff not authorized for this event");
        }

        // 4. Update Booking Status
        booking.BookingStatus = AppConstants.BookingStatus.CheckedIn;
        booking.CheckedInByStaffId = sId;
        booking.CheckedInAt = DateTime.UtcNow;

        // 5. Success check-in
        var log = new CheckInLog
        {
            BookingId = booking.Id,
            ScannedByStaffId = sId,
            EventId = booking.EventId,
            ScannedAt = DateTime.UtcNow,
            Result = AppConstants.CheckInResult.Valid
        };

        _context.CheckInLogs.Add(log);
        await _context.SaveChangesAsync();

        // Reload log with includes for UI
        var fullLog = await _context.CheckInLogs
            .Include(l => l.Booking)
                .ThenInclude(b => b.User)
            .Include(l => l.Booking)
                .ThenInclude(b => b.Seat)
            .Include(l => l.Event)
            .FirstOrDefaultAsync(l => l.Id == log.Id);

        return ApiResponse<CheckInLog>.Ok(fullLog!, "Check-in successful");
    }

    public async Task<ApiResponse<IEnumerable<CheckInLog>>> GetRecentLogsAsync(string staffId)
    {
        if (!int.TryParse(staffId, out int sId)) return ApiResponse<IEnumerable<CheckInLog>>.Fail("Invalid staff id");

        var logs = await _context.CheckInLogs
            .Include(l => l.Booking)
                .ThenInclude(b => b.User)
            .Include(l => l.Booking)
                .ThenInclude(b => b.Seat)
            .Include(l => l.Event)
            .Where(l => l.ScannedByStaffId == sId)
            .OrderByDescending(l => l.ScannedAt)
            .Take(50)
            .ToListAsync();

        return ApiResponse<IEnumerable<CheckInLog>>.Ok(logs);
    }

    private async Task<ApiResponse<CheckInLog>> LogAndReturn(int? bookingId, int staffId, int eventId, string result, string message)
    {
        var log = new CheckInLog
        {
            BookingId = bookingId ?? 0,
            ScannedByStaffId = staffId,
            EventId = eventId,
            ScannedAt = DateTime.UtcNow,
            Result = result
        };

        if (bookingId.HasValue && bookingId > 0)
        {
            _context.CheckInLogs.Add(log);
            await _context.SaveChangesAsync();
        }

        return ApiResponse<CheckInLog>.Fail(message, 400);
    }
}
