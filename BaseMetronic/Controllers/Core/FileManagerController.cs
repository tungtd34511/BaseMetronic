using BaseMetronic.Models.Entities;
using BaseMetronic.Service.Common;
using BaseMetronic.Service.Interface;
using BaseMetronic.Utilities;
using BaseMetronic.ViewModels.FileManagers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseMetronic.Controllers.Core
{
    [Route("file-manager")]
    [ApiController]
    public class FileManagerController : BaseApiController<DirectoryItem>
    {
        private readonly IDirectoryItemService _directoryItemService;
        private readonly ILogger _logger;
        public FileManagerController(IBaseService<DirectoryItem> service, IAPILogService aPILogService, ILoggerFactory loggerFactory, IDirectoryItemService directoryItemService) : base(service, aPILogService, loggerFactory)
        {
            _directoryItemService = directoryItemService;
            _logger = loggerFactory.CreateLogger<FileManagerController>();
        }

        [HttpGet("api/get-info")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]       
        
        public async Task<IActionResult> GetInfo()
        {
            try
            {
                var res = await _directoryItemService.GetInfo();
                return Ok(res);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Some thing wrong when GetInfo");
                return BadRequest();
            }
        }

        [HttpPost("api/add-folder")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddFolder([FromBody] AddFolderDTO dto)
        {
            try
            {
                var res = await _directoryItemService.AddFolder(dto);
                return Ok(res);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Some thing wrong when AddFolder([FromBody] AddFolderDTO dto)");
                return BadRequest();
            }
        }

        [HttpGet("api/list")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> List([FromQuery] DirectoryItemRequest request)
        {
            try
            {
                var res = await _directoryItemService.List(request);
                return Ok(res);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Some thing wrong when List([FromQuery] DirectoryItemRequest request)");
                return BadRequest();
            }
        }

        [HttpDelete("api/delete/{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var res = await _directoryItemService.DeleteAsync(id);
                return Ok(res);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Some thing wrong when Delete([FromForm] DirectoryItem model)");
                return BadRequest();
            }
        }

        [HttpPut("api/rename-folder")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RenameFolder([FromBody]RenameDirectoryItemDTO model)
        {
            try
            {
                var res = await _directoryItemService.RenameFolder(model);
                return Ok(res);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Some thing wrong when RenameFolder([FromBody]RenameDirectoryItemDTO model)");
                return BadRequest();
            }
        }
        
    }
}
