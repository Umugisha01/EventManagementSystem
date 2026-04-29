using RwandaEventHub.DTOs.Shared;
using RwandaEventHub.Models;

namespace RwandaEventHub.Interfaces;

public interface IVerifyService
{
    Task<ApiResponse<CheckInLog>> VerifyTicketAsync(string qrCode, string staffId);
    Task<ApiResponse<IEnumerable<CheckInLog>>> GetRecentLogsAsync(string staffId);
}
