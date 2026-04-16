using Microsoft.AspNetCore.Mvc;

namespace EventManagementSystem.Module3_RegistrationPayment.Controllers
{
    public class RegistrationController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult Create() => View();
        public IActionResult MyBookings() => View();
        public IActionResult CheckIn() => View();
        public IActionResult Ticket() => View();
    }
}
