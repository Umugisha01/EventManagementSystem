using System;

namespace EventManagementSystem.Common.Helpers
{
    public static class QRCodeHelper
    {
        public static string GenerateQrCodeData(string input)
        {
            // Placeholder - real implementation would call a QR library
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(input));
        }
    }
}
