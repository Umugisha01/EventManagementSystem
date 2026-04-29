using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RwandaEventHub.Models;

public class EventPricing
{
    [Key]
    public int Id { get; set; }

    public int EventId { get; set; }

    [Required, MaxLength(20)]
    public string SeatClass { get; set; } = "General"; // VVIP, VIP, Regular, General

    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    public int TotalCapacity { get; set; }
    public int BookedCount { get; set; } = 0;

    // Navigation
    [ForeignKey(nameof(EventId))]
    public Event? Event { get; set; }
}
