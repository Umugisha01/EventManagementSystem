using System;

namespace EventManagementSystem.Module4_ReportingExport.Models
{
    public class AuditLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Action { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
