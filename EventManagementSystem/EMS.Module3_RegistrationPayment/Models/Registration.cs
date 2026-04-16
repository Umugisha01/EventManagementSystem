using System;

namespace EventManagementSystem.Module3_RegistrationPayment.Models
{
    public class Registration
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
    }
}
