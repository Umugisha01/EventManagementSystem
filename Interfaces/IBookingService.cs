using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Interfaces;

public interface IBookingService
{
    Task<ApiResponse<Booking>> CreateBookingAsync(Booking booking);
    Task<ApiResponse<Booking>> GetBookingByIdAsync(int id);
    Task<ApiResponse<IEnumerable<Booking>>> GetUserBookingsAsync(string userId);
    Task<ApiResponse<bool>> CancelBookingAsync(int id);
}
