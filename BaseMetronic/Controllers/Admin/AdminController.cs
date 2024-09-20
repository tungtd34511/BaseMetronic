using BaseMetronic.Constants;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace BaseMetronic.Controllers.Admin
{
    [Route("[controller]")]
    public class AdminController : Controller
    {
        [Route("")]
        [Route("index")]
        public IActionResult Index()
        {
            return View();
        }

        [Route("sign-in")]
        public IActionResult SignIn(string returnUrl)
        {
            // Pass the returnUrl to the view to use it after login
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [Route("sign-out")]
        public IActionResult SignOut()
        {
            // Capture the current URL (full path) to redirect back after signing in again
            string redirectUrl = HttpContext.Request.GetDisplayUrl();  // Gets the full current URL
            HttpContext.Response.Cookies.Delete(SystemConstant.Authorization.Scheme);
            return RedirectToAction("SignIn", new { returnUrl = redirectUrl });
        }

        [Route("reset-password")]
        public IActionResult ResetPassword()
        {
            return View();
        }

        [Route("sign-up")]
        public IActionResult SignUp()
        {
            return View();
        }
    }
}
