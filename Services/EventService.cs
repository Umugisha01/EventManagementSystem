using Microsoft.EntityFrameworkCore;
using RwandaEventHub.Data;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;
using RwandaEventHub.Constants;

namespace RwandaEventHub.Services;

public class EventService : IEventService
{
    private readonly AppDbContext _context;

    public EventService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<IEnumerable<Event>>> GetAllEventsAsync()
    {
        // Admin/Managers see all events, including drafts
        var events = await _context.Events
            .Include(e => e.Venue)
            .Include(e => e.Manager)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
            
        return ApiResponse<IEnumerable<Event>>.Ok(events);
    }

    public async Task<ApiResponse<Event>> GetEventByIdAsync(int id)
    {
        var @event = await _context.Events
            .Include(e => e.Venue)
            .Include(e => e.Manager)
            .Include(e => e.PricingTiers)
            .FirstOrDefaultAsync(e => e.Id == id);
            
        if (@event == null) return ApiResponse<Event>.NotFound();
        return ApiResponse<Event>.Ok(@event);
    }

    public async Task<ApiResponse<Event>> CreateEventAsync(Event @event)
    {
        @event.Status = AppConstants.EventStatus.Draft;
        @event.CreatedAt = DateTime.UtcNow;

        _context.Events.Add(@event);
        await _context.SaveChangesAsync();
        
        return ApiResponse<Event>.Created(@event);
    }

    public async Task<ApiResponse<Event>> UpdateEventAsync(Event @event)
    {
        var existing = await _context.Events
            .Include(e => e.PricingTiers)
            .FirstOrDefaultAsync(e => e.Id == @event.Id);

        if (existing == null) return ApiResponse<Event>.NotFound();

        // Update core properties
        existing.Title = @event.Title;
        existing.Description = @event.Description;
        existing.Category = @event.Category;
        existing.VenueId = @event.VenueId;
        existing.ManagerId = @event.ManagerId;
        existing.StartDate = @event.StartDate;
        existing.EndDate = @event.EndDate;
        existing.ImageUrl = @event.ImageUrl;
        existing.Status = @event.Status;

        // Update Pricing Tiers: Remove old ones and add new ones (simpler than syncing)
        _context.EventPricings.RemoveRange(existing.PricingTiers);
        foreach (var tier in @event.PricingTiers)
        {
            tier.EventId = existing.Id;
            tier.Id = 0; // Ensure they are treated as new
            _context.EventPricings.Add(tier);
        }

        await _context.SaveChangesAsync();
        return ApiResponse<Event>.Ok(existing);
    }

    public async Task<ApiResponse<bool>> DeleteEventAsync(int id)
    {
        var @event = await _context.Events.FindAsync(id);
        if (@event == null) return ApiResponse<bool>.NotFound();
        
        _context.Events.Remove(@event);
        await _context.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, "Event deleted successfully");
    }
}
