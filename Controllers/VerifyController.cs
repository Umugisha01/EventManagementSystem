using Microsoft.AspNetCore.Mvc;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VerifyController : ControllerBase
{
    private readonly IVerifyService _verifyService;

    public VerifyController(IVerifyService verifyService)
    {
        _verifyService = verifyService;
    }

    [HttpPost("ticket")]
    public async Task<ActionResult<ApiResponse<CheckInLog>>> VerifyTicket([FromBody] VerifyRequest request)
    {
        var result = await _verifyService.VerifyTicketAsync(request.QrCode, request.StaffId);
        return Ok(result);
    }

    [HttpGet("logs")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CheckInLog>>>> GetRecentLogs([FromQuery] string staffId)
    {
        var result = await _verifyService.GetRecentLogsAsync(staffId);
        return Ok(result);
    }
}

public class VerifyRequest
{
    public string QrCode { get; set; } = string.Empty;
    public string StaffId { get; set; } = string.Empty;
}
