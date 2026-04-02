using System;

namespace EventManagementSystem.Module1_VenueSeat.Models
{
    public class Venue
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Address { get; set; }
    }
}
