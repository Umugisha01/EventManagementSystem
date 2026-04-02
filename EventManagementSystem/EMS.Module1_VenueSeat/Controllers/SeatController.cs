using Microsoft.AspNetCore.Mvc;

namespace EventManagementSystem.Module1_VenueSeat.Controllers
{
    public class SeatController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult SeatMap() => View();
        public IActionResult Create() => View();
        public IActionResult Edit() => View();
        public IActionResult Import() => View();
    }
}
