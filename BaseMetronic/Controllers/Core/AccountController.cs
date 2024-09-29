using BaseMetronic.Models.Entities;
using BaseMetronic.Service.Interface;
using BaseMetronic.Utilities;
using BaseMetronic.ViewModels.Accounts;
using Microsoft.AspNetCore.Mvc;

namespace BaseMetronic.Controllers.Core
{
    [Route("[controller]")]
    public class AccountController : BaseApiController<Account>
    {
        private readonly IAccountService _service;
        private readonly ILogger _logger;
        public AccountController(IAccountService service, ILoggerFactory loggerFactory, IAPILogService aPILogService) : base(service,aPILogService, loggerFactory)
        {
            _service = service;
            _logger = loggerFactory.CreateLogger<AccountController>();
        }

        [HttpPost("api/sign-up")]
        public async Task<IActionResult> SignUp([FromBody] SignUpVM model)
        {
            try
            {
                var res = await _service.SignUp(model);
                return Ok(res);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Some thing wrong when SignUp");
                return BadRequest();
            }
        }

        [HttpPost("api/sign-in")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest model)
        {
            try
            {
                var res = await _service.Authenticate(model);
                return Ok(res);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Some thing wrong when SignIn");
                return BadRequest();
            }
        }
    }
}
