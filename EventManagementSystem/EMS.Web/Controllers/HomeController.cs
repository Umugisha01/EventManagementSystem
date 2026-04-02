using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace EventManagementSystem.Web.Controllers
{
    public class HomeController : Controller
    {
        // Serve the cshtml file as static HTML fallback to avoid view-engine failures
        // in environments where Razor view discovery isn't configured.
        public IActionResult Index()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Views", "Home", "Index.cshtml");
            if (System.IO.File.Exists(path))
            {
                var content = System.IO.File.ReadAllText(path);
                // Strip Razor layout directive if present so returned HTML is valid.
                content = content.Replace("@{\n    Layout = \"~/Views/Shared/_Layout.cshtml\";\n}", string.Empty);
                return Content(content, "text/html");
            }

            return Content("<h1>Home</h1>", "text/html");
        }

        public IActionResult Privacy()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Views", "Home", "Privacy.cshtml");
            if (System.IO.File.Exists(path))
            {
                var content = System.IO.File.ReadAllText(path);
                content = content.Replace("@{\n    Layout = \"~/Views/Shared/_Layout.cshtml\";\n}", string.Empty);
                return Content(content, "text/html");
            }

            return Content("<h1>Privacy</h1>", "text/html");
        }
    }
}
