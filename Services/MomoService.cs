using RwandaEventHub.Interfaces;
using RwandaEventHub.DTOs.Shared;
using System.Text.RegularExpressions;

namespace RwandaEventHub.Services;

public class MomoService : IMomoService
{
    public async Task<ApiResponse<string>> RequestPaymentAsync(string phoneNumber, decimal amount, string reference)
    {
        // 1. Validate Phone Format: 10 digits, starting 078 or 079
        if (string.IsNullOrWhiteSpace(phoneNumber) || !Regex.IsMatch(phoneNumber, @"^07[89]\d{7}$"))
        {
            return ApiResponse<string>.Fail("Invalid phone number format. Must be 10 digits starting with 078 or 079.");
        }

        // 2. Validate Amount
        if (amount <= 0)
        {
            return ApiResponse<string>.Fail("Amount must be greater than 0.");
        }

        // Mocking MTN MoMo API call
        await Task.Delay(500);
        return ApiResponse<string>.Ok(Guid.NewGuid().ToString(), "Payment request sent to " + phoneNumber);
    }

    public async Task<ApiResponse<string>> GetPaymentStatusAsync(string transactionReference)
    {
        // Simulate MoMo network confirmation
        return ApiResponse<string>.Ok("SUCCESS", "Payment confirmed via MoMo network");
    }
}
