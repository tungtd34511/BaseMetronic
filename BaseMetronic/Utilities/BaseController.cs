using BaseMetronic.Models.Common;
using BaseMetronic.Service.Common;
using BaseMetronic.Service.Interface;
using BaseMetronic.Utilities.Extensions;
using BaseMetronic.ViewModels.APILogs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace BaseMetronic.Utilities
{
    public class BaseController : Controller
    {
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            await base.OnActionExecutionAsync(context, next);
        }
        
    }
    public class BaseApiController<T> : BaseController where T : EntityBase<int>
    {
        private readonly IBaseService<T> _service;
        private readonly ILogger _logger;
        private readonly IAPILogService _aPILogService;
        public BaseApiController(IBaseService<T> service, IAPILogService aPILogService, ILoggerFactory loggerFactory)
        {
            _service = service;
            _aPILogService = aPILogService;
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
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            string RequestedURL = context.HttpContext.Request.Path.ToString().ToLower();
            if (RequestedURL.Contains("api"))
            {
                if (!ModelState.IsValid)//valid model state
                {
                    var errors = ModelState.Values.SelectMany(c => c.Errors).Select(c => c.ErrorMessage);
                    context.Result = Ok(DionResponse.BadRequest("Dữ liệu không hợp lệ!", errors));
                }
            }
            await base.OnActionExecutionAsync(context, next);
        }
        /// <summary>
        /// Author: TUNGTD
        /// CreatedDate: 28/09/2024
        /// Description: Ghi lại lịch sử API LOG
        /// </summary>
        /// <returns></returns>
        public override OkObjectResult Ok([ActionResultObjectValue] object? value)
        {
            try
            {
                //Save API LOG
                if (User.Identity != null && User.Identity.IsAuthenticated && value != null && value.GetType().FullName == typeof(DionResponse).FullName && HttpContext.Request.Method!= "GET")
                {
                    DionResponse res = value as DionResponse ?? DionResponse.BadRequest();
                    _aPILogService.AddAsync(new AddAPILogDTO()
                    {
                        StatusCode = res.Status,
                        AccountId = this.GetLoggedInUserId<int>(),
                        Path = string.Join("", HttpContext.Request.Path.Value, HttpContext.Request.QueryString),
                        Title = res.Message,
                        Type = HttpContext.Request.Method
                    });
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Something wrong when Save API LOG");
            }
            return base.Ok(value);
        }
    }
}
