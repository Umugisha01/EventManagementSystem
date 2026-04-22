using System;

namespace EventManagementSystem.Module3_RegistrationPayment.Models
{
    public class Ticket
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Code { get; set; }
    }
}
