using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Interfaces;

public interface IEventService
{
    Task<ApiResponse<IEnumerable<Event>>> GetAllEventsAsync();
    Task<ApiResponse<Event>> GetEventByIdAsync(int id);
    Task<ApiResponse<Event>> CreateEventAsync(Event @event);
    Task<ApiResponse<Event>> UpdateEventAsync(Event @event);
    Task<ApiResponse<bool>> DeleteEventAsync(int id);
}
