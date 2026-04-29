using Microsoft.EntityFrameworkCore;
using RwandaEventHub.Data;
using RwandaEventHub.Interfaces;
using RwandaEventHub.DTOs.Shared;
using RwandaEventHub.Constants;

namespace RwandaEventHub.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly AppDbContext _context;

    public AnalyticsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<object>> GetEventAnalyticsAsync(int eventId)
    {
        var totalBookings = await _context.Bookings.CountAsync(b => b.EventId == eventId && b.BookingStatus == AppConstants.BookingStatus.Confirmed);
        var totalRevenue = await _context.Payments
            .Where(p => p.Booking!.EventId == eventId && p.Status == AppConstants.PaymentStatus.Success)
            .SumAsync(p => p.Amount);

        var checkIns = await _context.CheckInLogs.CountAsync(l => l.EventId == eventId && l.Result == AppConstants.CheckInResult.Valid);

        return ApiResponse<object>.Ok(new 
        { 
            TotalBookings = totalBookings, 
            TotalRevenue = totalRevenue,
            ActualAttendance = checkIns
        });
    }

    public async Task<ApiResponse<object>> GetPlatformAnalyticsAsync()
    {
        var totalEvents = await _context.Events.CountAsync();
        var totalUsers = await _context.Users.CountAsync(u => u.Role == AppConstants.Roles.Attendee);
        
        return ApiResponse<object>.Ok(new { TotalEvents = totalEvents, TotalAttendees = totalUsers });
    }
}
