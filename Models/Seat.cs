using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RwandaEventHub.Models;

public class Seat
{
    [Key]
    public int Id { get; set; }

    public int VenueId { get; set; }

    [Required, MaxLength(10)]
    public string SeatNumber { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Row { get; set; }

    [Required, MaxLength(20)]
    public string Class { get; set; } = "General"; // VVIP, VIP, Regular, General

    [Required, MaxLength(20)]
    public string Status { get; set; } = "Available"; // Available, Reserved, Booked

    // Navigation
    [ForeignKey(nameof(VenueId))]
    public Venue? Venue { get; set; }
}
