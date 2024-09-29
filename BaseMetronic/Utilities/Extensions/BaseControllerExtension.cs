using BaseMetronic.Constants;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BaseMetronic.Utilities.Extensions
{
    public static class BaseControllerExtension
    {
        /// <summary>
        /// Return logged in user info
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetLoggedInUserInfo(this ControllerBase controller, string key)
        {
            try
            {
                if (controller.HttpContext.User.Identity is ClaimsIdentity identity)
                {
                    return identity.FindFirst(key)?.Value;
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// Return logged in user info
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static int? GetLoggedInUserId(this HttpContext? context)
        {
            try
            {
                if (context?.User.Identity is ClaimsIdentity identity)
                {
                    return Convert.ToInt32(identity.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T">Type of name identifier</typeparam>
        /// <param name="controller"></param>
        /// <returns></returns>
        public static T GetLoggedInUserId<T>(this ControllerBase controller) 
        {
            return (T)Convert.ChangeType(GetLoggedInUserInfo(controller, ClaimTypes.NameIdentifier), typeof(T));
        }
        public static int GetLoggedInUserId(this ControllerBase controller)
        {
            return (int)Convert.ChangeType(GetLoggedInUserInfo(controller, ClaimTypes.NameIdentifier), typeof(int));
        }
    }
}
