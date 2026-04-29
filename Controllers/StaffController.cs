using Microsoft.AspNetCore.Mvc;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StaffController : ControllerBase
{
    private readonly IStaffService _staffService;

    public StaffController(IStaffService staffService)
    {
        _staffService = staffService;
    }

    [HttpPost("assign")]
    public async Task<ActionResult<ApiResponse<StaffAssignment>>> Assign([FromBody] StaffAssignment assignment)
    {
        var result = await _staffService.AssignStaffAsync(assignment);
        return Ok(result);
    }

    [HttpGet("event/{eventId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<StaffAssignment>>>> GetEventStaff(int eventId)
    {
        var result = await _staffService.GetEventStaffAsync(eventId);
        return Ok(result);
    }

    [HttpGet("assignments/{staffId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<StaffAssignment>>>> GetAssignments(int staffId)
    {
        var result = await _staffService.GetStaffAssignmentsAsync(staffId);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Remove(int id)
    {
        var result = await _staffService.RemoveStaffAssignmentAsync(id);
        return Ok(result);
    }
}
