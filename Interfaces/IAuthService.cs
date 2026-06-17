using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Interfaces;

public interface IAuthService
{
    Task<ApiResponse<LoginResult>> LoginAsync(string identifier, string password);
    Task<ApiResponse<User>> RegisterAsync(User user, string password);
}
