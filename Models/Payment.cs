using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RwandaEventHub.Models;

public class Payment
{
    [Key]
    public int Id { get; set; }

    public int BookingId { get; set; }

    [Required, MaxLength(15)]
    public string Phone { get; set; } = string.Empty; // 078 or 079

    [Required, MaxLength(100)]
    public string TransactionRef { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Method { get; set; } = "MoMo";

    [Required, MaxLength(20)]
    public string Status { get; set; } = "Pending"; // Pending, Success, Failed

    [Column(TypeName = "decimal(10,2)")]
    public decimal Amount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey(nameof(BookingId))]
    public Booking? Booking { get; set; }
}
