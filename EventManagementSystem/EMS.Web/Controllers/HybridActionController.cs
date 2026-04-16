using Microsoft.AspNetCore.Mvc;

namespace EventManagementSystem.Web.Controllers
{
    // Lightweight endpoint to satisfy third-party JSONP tracker calls seen in console.
    // This returns a 200 response for requests to /hybridaction/zybTrackerStatisticsAction
    // and invokes the provided JSONP callback with an empty object.
    [ApiController]
    public class HybridActionController : ControllerBase
    {
        [HttpGet("/hybridaction/zybTrackerStatisticsAction")]
        public IActionResult ZybTrackerStatisticsAction([FromQuery] string data = "{}", [FromQuery(Name = "__callback__")] string callback = null)
        {
            if (!string.IsNullOrEmpty(callback))
            {
                // Return JSONP callback invocation
                var payload = string.IsNullOrEmpty(data) ? "{}" : data;
                var script = $"{callback}({payload});";
                return Content(script, "application/javascript");
            }

            // Fallback: return empty JSON
            return new JsonResult(new { });
        }
    }
}
