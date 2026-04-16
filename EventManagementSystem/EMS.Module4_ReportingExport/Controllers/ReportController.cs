using Microsoft.AspNetCore.Mvc;

namespace EventManagementSystem.Module4_ReportingExport.Controllers
{
    public class ReportController : Controller
    {
        public IActionResult Occupancy() => View();
        public IActionResult Revenue() => View();
        public IActionResult Attendance() => View();
    }
}
