using System.ComponentModel.DataAnnotations;

namespace RwandaEventHub.Models;

public class Venue
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Address { get; set; } = string.Empty;

    public int Capacity { get; set; }

    [Required, MaxLength(50)]
    public string Type { get; set; } = "Physical"; // Physical, Virtual

    public string? LayoutJson { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    public ICollection<Event> Events { get; set; } = new List<Event>();
}
