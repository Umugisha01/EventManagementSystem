using System;

namespace EventManagementSystem.Module4_ReportingExport.Models
{
    public class Notification
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Message { get; set; }
    }
}
