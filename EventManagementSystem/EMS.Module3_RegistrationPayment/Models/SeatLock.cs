using System;

namespace EventManagementSystem.Module3_RegistrationPayment.Models
{
    public class SeatLock
    {
        public Guid SeatId { get; set; }
        public DateTime LockedUntil { get; set; }
    }
}
