using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RwandaEventHub.Models;

public class Event
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Category { get; set; }

    public int VenueId { get; set; }
    public int? ManagerId { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public string? ImageUrl { get; set; }
    public string? Description { get; set; }

    [Required, MaxLength(20)]
    public string Status { get; set; } = "Draft"; // Draft, Published, Completed, Cancelled

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey(nameof(VenueId))]
    public Venue? Venue { get; set; }

    [ForeignKey(nameof(ManagerId))]
    public User? Manager { get; set; }

    public ICollection<EventPricing> PricingTiers { get; set; } = new List<EventPricing>();
    public ICollection<StaffAssignment> StaffAssignments { get; set; } = new List<StaffAssignment>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
