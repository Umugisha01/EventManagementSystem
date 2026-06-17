using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Interfaces;

public interface IAnalyticsService
{
    Task<ApiResponse<object>> GetEventAnalyticsAsync(int eventId);
    Task<ApiResponse<object>> GetPlatformAnalyticsAsync();
}
