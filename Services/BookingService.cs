using Microsoft.EntityFrameworkCore;
using RwandaEventHub.Data;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;
using RwandaEventHub.Constants;

namespace RwandaEventHub.Services;

public class BookingService : IBookingService
{
    private readonly AppDbContext _context;

    public BookingService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<Booking>> CreateBookingAsync(Booking booking)
    {
        // Check seat availability
        var seat = await _context.Seats.FindAsync(booking.SeatId);
        if (seat == null || seat.Status != AppConstants.SeatStatus.Available)
            return ApiResponse<Booking>.Fail("Seat is not available.");

        // Check tier capacity
        var tier = await _context.EventPricings
            .FirstOrDefaultAsync(p => p.EventId == booking.EventId && p.SeatClass == seat.Class);
        if (tier == null || tier.BookedCount >= tier.TotalCapacity)
            return ApiResponse<Booking>.Fail("Capacity reached for this seat class.");

        // Initialize booking
        booking.BookingStatus = AppConstants.BookingStatus.Reserved;
        booking.PaymentStatus = AppConstants.PaymentStatus.Pending;
        booking.BookingDate = DateTime.UtcNow;
        booking.ExpiresAt = DateTime.UtcNow.AddMinutes(10);
        booking.TotalPrice = tier.Price;

        // Reserve seat
        seat.Status = AppConstants.SeatStatus.Reserved;
        
        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        // Generate QRTicketCode based on the DB ID and Event ID for context
        booking.QRTicketCode = $"REH-{booking.EventId}-{booking.Id}";
        await _context.SaveChangesAsync();

        return ApiResponse<Booking>.Created(booking);
    }

    public async Task<ApiResponse<Booking>> GetBookingByIdAsync(int id)
    {
        var booking = await _context.Bookings
            .Include(b => b.Event)
            .Include(b => b.Seat)
            .FirstOrDefaultAsync(b => b.Id == id);
            
        if (booking == null) return ApiResponse<Booking>.NotFound();
        return ApiResponse<Booking>.Ok(booking);
    }

    public async Task<ApiResponse<IEnumerable<Booking>>> GetUserBookingsAsync(string userId)
    {
        if (!int.TryParse(userId, out int uId)) return ApiResponse<IEnumerable<Booking>>.Fail("Invalid user id");

        var bookings = await _context.Bookings
            .Include(b => b.Event)
            .Include(b => b.Seat)
            .Include(b => b.User)
            .Include(b => b.CheckedInByStaff)
            .Where(b => b.UserId == uId)
            .OrderByDescending(b => b.BookingDate)
            .ToListAsync();
        return ApiResponse<IEnumerable<Booking>>.Ok(bookings);
    }

    public async Task<ApiResponse<bool>> CancelBookingAsync(int id)
    {
        var booking = await _context.Bookings.Include(b => b.Seat).FirstOrDefaultAsync(b => b.Id == id);
        if (booking == null) return ApiResponse<bool>.NotFound();
        
        booking.BookingStatus = AppConstants.BookingStatus.Cancelled;
        if (booking.Seat != null)
        {
            booking.Seat.Status = AppConstants.SeatStatus.Available;
        }

        await _context.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, "Booking cancelled successfully");
    }

    public async Task CleanupExpiredBookingsAsync()
    {
        var expiredBookings = await _context.Bookings
            .Include(b => b.Seat)
            .Where(b => b.BookingStatus == AppConstants.BookingStatus.Reserved && b.ExpiresAt < DateTime.UtcNow)
            .ToListAsync();

        foreach (var booking in expiredBookings)
        {
            booking.BookingStatus = AppConstants.BookingStatus.Expired;
            if (booking.Seat != null)
            {
                booking.Seat.Status = AppConstants.SeatStatus.Available;
            }
        }

        await _context.SaveChangesAsync();
    }
}
