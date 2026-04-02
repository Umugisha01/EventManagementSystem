using System.Collections.Generic;

namespace EventManagementSystem.Module1_VenueSeat.Services
{
    public class SeatMapService
    {
        public IEnumerable<string> GetSeatMap() => new[] { "A1", "A2", "B1" };
    }
}
