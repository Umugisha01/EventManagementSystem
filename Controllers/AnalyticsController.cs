using Microsoft.AspNetCore.Mvc;
using RwandaEventHub.Interfaces;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("event/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> GetEventAnalytics(int id)
    {
        var result = await _analyticsService.GetEventAnalyticsAsync(id);
        return Ok(result);
    }

    [HttpGet("platform")]
    public async Task<ActionResult<ApiResponse<object>>> GetPlatformAnalytics()
    {
        var result = await _analyticsService.GetPlatformAnalyticsAsync();
        return Ok(result);
    }
}
