using Microsoft.AspNetCore.Mvc;

namespace EventManagementSystem.Module2_EventSpeaker.Controllers
{
    public class EventController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult Create() => View();
        public IActionResult Edit() => View();
        public IActionResult Details() => View();
        public IActionResult MyEvents() => View();
    }
}
