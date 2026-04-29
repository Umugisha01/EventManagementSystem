using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;
using RwandaEventHub.Constants;

namespace RwandaEventHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> _userManager;

    public UsersController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<User>>>> GetUsers()
    {
        var users = await _userManager.Users.OrderByDescending(u => u.CreatedAt).ToListAsync();
        return Ok(ApiResponse<IEnumerable<User>>.Ok(users));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<User>>> CreateUser([FromBody] UserCreateRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            return BadRequest(ApiResponse<User>.Fail("Email already exists"));

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            UserName = request.Username,
            PhoneNumber = request.PhoneNumber,
            Role = request.Role,
            IsActive = true,
            IsNewUser = request.Role != AppConstants.Roles.Attendee // Staff/Managers need reset
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(ApiResponse<User>.Fail("Failed to create user", 400, result.Errors.Select(e => e.Description).ToList()));

        return Ok(ApiResponse<User>.Created(user, "User created successfully"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<User>>> UpdateUser(int id, [FromBody] UserUpdateRequest request)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound(ApiResponse<User>.Fail("User not found"));

        user.FullName = request.FullName;
        user.PhoneNumber = request.PhoneNumber;
        user.IsActive = request.IsActive;
        user.Role = request.Role;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(ApiResponse<User>.Fail("Update failed", 400, result.Errors.Select(e => e.Description).ToList()));

        return Ok(ApiResponse<User>.Ok(user, "User updated successfully"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteUser(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound(ApiResponse<bool>.Fail("User not found"));

        // Don't delete the last admin (safety)
        if (user.Role == AppConstants.Roles.Admin)
        {
            var adminCount = await _userManager.Users.CountAsync(u => u.Role == AppConstants.Roles.Admin);
            if (adminCount <= 1) return BadRequest(ApiResponse<bool>.Fail("Cannot delete the last administrator"));
        }

        var result = await _userManager.DeleteAsync(user);
        return Ok(ApiResponse<bool>.Ok(result.Succeeded));
    }
}

public class UserCreateRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class UserUpdateRequest
{
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
