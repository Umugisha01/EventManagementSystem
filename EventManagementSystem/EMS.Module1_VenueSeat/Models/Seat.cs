using System;

namespace EventManagementSystem.Module1_VenueSeat.Models
{
    public class Seat
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Row { get; set; }
        public int Number { get; set; }
        public bool IsAvailable { get; set; } = true;
    }
}
