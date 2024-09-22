using BaseMetronic.Service.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace BaseMetronic.Utilities
{
    public class BaseController : Controller
    {
        public override Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            string RequestedURL = context.HttpContext.Request.Path.ToString().ToLower();
            if (RequestedURL.Contains("api"))
            {
                if (!ModelState.IsValid)//valid model state
                {
                    var errors = ModelState.Values.SelectMany(c => c.Errors).Select(c => c.ErrorMessage);
                    context.Result = Ok(DionResponse.BadRequest(errors));
                }
            }
            return base.OnActionExecutionAsync(context, next);
        }

        /// <summary>
        /// Ghi lại lịch sử API LOG
        /// </summary>
        /// <returns></returns>
        public override OkObjectResult Ok([ActionResultObjectValue] object? value)
        {
            return base.Ok(value);
        }
    }
    public class BaseApiController<T> : BaseController where T : class
    {
        private readonly IBaseService<T> _service;
        private readonly ILogger _logger;
        public BaseApiController(IBaseService<T> service, ILoggerFactory loggerFactory)
        {
            _service = service;
            _logger = loggerFactory.CreateLogger<BaseApiController<T>>();
        }

        [Route("api/list")]
        public async Task<IActionResult> List()
        {
            try
            {
                var res = await _service.GetAllAsync();
                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Some thing wrong when get list {typeof(T).Name}");
                return BadRequest();
            }
        }
    }
}
