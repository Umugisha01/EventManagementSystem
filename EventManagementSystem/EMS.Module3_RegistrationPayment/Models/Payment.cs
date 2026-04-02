using System;

namespace EventManagementSystem.Module3_RegistrationPayment.Models
{
    public class Payment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public decimal Amount { get; set; }
        public DateTime PaidAt { get; set; }
    }
}
