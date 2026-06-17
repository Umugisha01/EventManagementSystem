using RwandaEventHub.Interfaces;

namespace RwandaEventHub.Services;

public class QRService : IQRService
{
    public async Task<string> GenerateQRCodeAsync(string content)
    {
        // Mocking QR generation (returning base64 or placeholder)
        await Task.Yield();
        return "qr_code_placeholder_for_" + content;
    }
}
