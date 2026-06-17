using Microsoft.AspNetCore.Mvc;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<Booking>>> Create([FromBody] Booking booking)
    {
        var result = await _bookingService.CreateBookingAsync(booking);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<Booking>>> GetById(int id)
    {
        var result = await _bookingService.GetBookingByIdAsync(id);
        return Ok(result);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<Booking>>>> GetUserBookings(string userId)
    {
        var result = await _bookingService.GetUserBookingsAsync(userId);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Cancel(int id)
    {
        var result = await _bookingService.CancelBookingAsync(id);
        return Ok(result);
    }
}
