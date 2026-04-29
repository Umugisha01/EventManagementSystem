using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RwandaEventHub.Models;

public class StaffAssignment
{
    [Key]
    public int Id { get; set; }

    public int StaffId { get; set; }
    public int EventId { get; set; }

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    // Navigation
    [ForeignKey(nameof(StaffId))]
    public User? Staff { get; set; }

    [ForeignKey(nameof(EventId))]
    public Event? Event { get; set; }
}
