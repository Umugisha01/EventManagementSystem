using Microsoft.AspNetCore.Mvc;

namespace EventManagementSystem.Module1_VenueSeat.Controllers
{
    public class VenueController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult Create() => View();
        public IActionResult Edit() => View();
        public IActionResult Delete() => View();
    }
}
