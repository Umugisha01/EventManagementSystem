using Microsoft.AspNetCore.Mvc;

namespace EventManagementSystem.Module4_ReportingExport.Controllers
{
    public class ExportController : Controller
    {
        public IActionResult ExportToExcel() => View();
        public IActionResult ExportToPdf() => View();
    }
}
