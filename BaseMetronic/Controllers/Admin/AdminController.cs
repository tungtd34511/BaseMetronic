using BaseMetronic.Constants;
using BaseMetronic.Utilities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseMetronic.Controllers.Admin
{
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AdminController : BaseController
    {
        [Route("")]
        public IActionResult Default()
        {
            return RedirectToAction("Index");
        }

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
            string redirectUrl = HttpContext.Request.Headers["Referer"].ToString(); // Gets the full current URL
            if (!string.IsNullOrEmpty(redirectUrl))
            {
                Uri refererUri = new Uri(redirectUrl);
                redirectUrl = refererUri.PathAndQuery;
                HttpContext.Response.Cookies.Delete(SystemConstant.Authorization.Scheme);
                return RedirectToAction("SignIn", new { returnUrl = redirectUrl });
            }
           
            return RedirectToAction("SignIn");
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
        #region Apps
        [Route("apps/file-manager/folders")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult Folders()
        {
            return View();
        }
        #endregion
        #region Errors
        [Route("error-404")]
        public IActionResult Error404()
        {
            return View();
        }
        #endregion
        #region Dashboards
        [Route("landing")]
        public IActionResult Landing()
        {
            return View();
        }
        #endregion 
    }
}
