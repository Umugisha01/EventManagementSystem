using Microsoft.AspNetCore.Mvc;

namespace EventManagementSystem.Module4_ReportingExport.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index() => View();
    }
}
