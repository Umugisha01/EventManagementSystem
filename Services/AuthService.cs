using Microsoft.AspNetCore.Identity;
using RwandaEventHub.Interfaces;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthService(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    public async Task<ApiResponse<LoginResult>> LoginAsync(string identifier, string password)
    {
        // Try finding by Email first
        var user = await _userManager.FindByEmailAsync(identifier);
        
        // If not found, try finding by Username
        if (user == null)
        {
            user = await _userManager.FindByNameAsync(identifier);
        }

        if (user == null) return ApiResponse<LoginResult>.Fail("Invalid credentials");

        var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
        if (!result.Succeeded) return ApiResponse<LoginResult>.Fail("Invalid credentials");

        var loginResult = new LoginResult
        {
            Token = "token_placeholder", // Real JWT generation would happen here
            Profile = new UserProfile
            {
                Id = user.Id,
                Name = user.FullName,
                Username = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = user.Role // Assuming Role is a custom field on your User model
            }
        };

        return ApiResponse<LoginResult>.Ok(loginResult, "Login successful");
    }

    public async Task<ApiResponse<User>> RegisterAsync(User user, string password)
    {
        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded) 
            return ApiResponse<User>.Fail("Registration failed", 400, result.Errors.Select(e => e.Description).ToList());

        return ApiResponse<User>.Created(user, "User registered successfully");
    }
}
