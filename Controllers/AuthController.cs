using Microsoft.AspNetCore.Mvc;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResult>>> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request.Identifier, request.Password);
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<User>>> Register([FromBody] RegisterRequest request)
    {
        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            UserName = request.Username,
            Role = request.Role
        };
        var result = await _authService.RegisterAsync(user, request.Password);
        return Ok(result);
    }
}

public class LoginRequest
{
    public string Identifier { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
