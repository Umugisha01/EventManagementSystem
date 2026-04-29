using Microsoft.AspNetCore.Mvc;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VenuesController : ControllerBase
{
    private readonly IVenueService _venueService;

    public VenuesController(IVenueService venueService)
    {
        _venueService = venueService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<Venue>>>> GetAll()
    {
        var result = await _venueService.GetAllVenuesAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<Venue>>> GetById(int id)
    {
        var result = await _venueService.GetVenueByIdAsync(id);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<Venue>>> Create([FromBody] Venue venue)
    {
        var result = await _venueService.CreateVenueAsync(venue);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<Venue>>> Update(int id, [FromBody] Venue venue)
    {
        var result = await _venueService.UpdateVenueAsync(id, venue);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var result = await _venueService.DeleteVenueAsync(id);
        return Ok(result);
    }

    [HttpPost("{id}/import-seats")]
    public async Task<ActionResult<ApiResponse<int>>> ImportSeats(int id, [FromForm] IFormFile file)
    {
        var result = await _venueService.ImportSeatsFromExcelAsync(id, file);
        return Ok(result);
    }
}
