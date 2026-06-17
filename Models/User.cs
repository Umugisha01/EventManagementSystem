using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace RwandaEventHub.Models;

public class User : IdentityUser<int>
{
    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Role { get; set; } = string.Empty; // Admin, Manager, Staff, Attendee

    public bool IsActive { get; set; } = true;
    public bool IsNewUser { get; set; } = true; // For staff password reset

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
