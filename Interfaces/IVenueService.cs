using RwandaEventHub.Models;
using RwandaEventHub.DTOs.Shared;
using Microsoft.AspNetCore.Http;

namespace RwandaEventHub.Interfaces;

public interface IVenueService
{
    Task<ApiResponse<IEnumerable<Venue>>> GetAllVenuesAsync();
    Task<ApiResponse<Venue>> GetVenueByIdAsync(int id);
    Task<ApiResponse<Venue>> CreateVenueAsync(Venue venue);
    Task<ApiResponse<Venue>> UpdateVenueAsync(int id, Venue venue);
    Task<ApiResponse<bool>> DeleteVenueAsync(int id);
    Task<ApiResponse<int>> ImportSeatsFromExcelAsync(int venueId, IFormFile file);
}
