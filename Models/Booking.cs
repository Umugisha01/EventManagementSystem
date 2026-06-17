using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RwandaEventHub.Models;

public class Booking
{
    [Key]
    public int Id { get; set; }

    public int EventId { get; set; }
    public int UserId { get; set; }
    public int SeatId { get; set; }

    public string? QRTicketCode { get; set; } // Base64 image

    [Required, MaxLength(20)]
    public string PaymentStatus { get; set; } = "Pending"; // Pending, Success, Failed

    [Required, MaxLength(20)]
    public string BookingStatus { get; set; } = "Reserved"; // Reserved, Confirmed, Expired, Cancelled

    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalPrice { get; set; }

    public DateTime BookingDate { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddMinutes(10);

    // Navigation
    [ForeignKey(nameof(EventId))]
    public Event? Event { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    [ForeignKey(nameof(SeatId))]
    public Seat? Seat { get; set; }

    public int? CheckedInByStaffId { get; set; }
    public DateTime? CheckedInAt { get; set; }

    [ForeignKey(nameof(CheckedInByStaffId))]
    public User? CheckedInByStaff { get; set; }

    public Payment? Payment { get; set; }
}
