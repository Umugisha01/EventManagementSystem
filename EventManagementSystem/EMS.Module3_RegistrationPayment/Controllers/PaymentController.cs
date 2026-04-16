using Microsoft.AspNetCore.Mvc;

namespace EventManagementSystem.Module3_RegistrationPayment.Controllers
{
    public class PaymentController : Controller
    {
        public IActionResult Process() => View();
        public IActionResult Receipt() => View();
    }
}
