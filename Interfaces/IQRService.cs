using RwandaEventHub.DTOs.Shared;

namespace RwandaEventHub.Interfaces;

public interface IQRService
{
    Task<string> GenerateQRCodeAsync(string content);
}
