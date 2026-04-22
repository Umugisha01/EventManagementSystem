using System;

namespace EventManagementSystem.Module2_EventSpeaker.Models
{
    public class Speaker
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Bio { get; set; }
    }
}
