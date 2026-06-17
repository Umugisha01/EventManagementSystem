using Microsoft.AspNetCore.Mvc;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<Event>>>> GetAll()
    {
        var result = await _eventService.GetAllEventsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<Event>>> GetById(int id)
    {
        var result = await _eventService.GetEventByIdAsync(id);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<Event>>> Create([FromBody] Event @event)
    {
        var result = await _eventService.CreateEventAsync(@event);
        return CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<Event>>> Update(int id, [FromBody] Event @event)
    {
        @event.Id = id;
        var result = await _eventService.UpdateEventAsync(@event);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var result = await _eventService.DeleteEventAsync(id);
        return Ok(result);
    }
}
