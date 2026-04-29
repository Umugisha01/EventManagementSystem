using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RwandaEventHub.Models;

public class CheckInLog
{
    [Key]
    public int Id { get; set; }

    public int BookingId { get; set; }
    public int ScannedByStaffId { get; set; }
    public int EventId { get; set; }

    public DateTime ScannedAt { get; set; } = DateTime.UtcNow;

    [Required, MaxLength(20)]
    public string Result { get; set; } = string.Empty; // Valid, AlreadyScanned, WrongEvent, InvalidTicket

    // Navigation
    [ForeignKey(nameof(BookingId))]
    public Booking? Booking { get; set; }

    [ForeignKey(nameof(ScannedByStaffId))]
    public User? ScannedByStaff { get; set; }

    [ForeignKey(nameof(EventId))]
    public Event? Event { get; set; }
}
