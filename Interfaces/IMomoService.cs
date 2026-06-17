using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Interfaces;

public interface IMomoService
{
    Task<ApiResponse<string>> RequestPaymentAsync(string phoneNumber, decimal amount, string reference);
    Task<ApiResponse<string>> GetPaymentStatusAsync(string transactionReference);
}
