using Microsoft.AspNetCore.Mvc;

namespace EventManagementSystem.Module2_EventSpeaker.Controllers
{
    public class EventSpeakerController : Controller
    {
        public IActionResult Index() => View();
    }
}
