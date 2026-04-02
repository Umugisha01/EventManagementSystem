using System;

namespace EventManagementSystem.Module2_EventSpeaker.Models
{
    public class Event
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; }
        public DateTime Date { get; set; }
    }
}
