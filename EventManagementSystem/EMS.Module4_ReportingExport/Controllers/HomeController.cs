using Microsoft.AspNetCore.Mvc;

namespace EventManagementSystem.Module4_ReportingExport.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Landing() => View();
    }
}
