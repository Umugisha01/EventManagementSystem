using RwandaEventHub.Models;

namespace RwandaEventHub.DTOs.Shared;

public class LoginResult
{
    public string Token { get; set; } = string.Empty;
    public UserProfile Profile { get; set; } = new();
}

public class UserProfile
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
