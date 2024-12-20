﻿using BaseMetronic.Models.Entities;
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
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class FileManagerController : BaseApiController<DirectoryItem>
    {
        private readonly IDirectoryItemService _directoryItemService;
        private readonly ILogger _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public FileManagerController(IBaseService<DirectoryItem> service, IAPILogService aPILogService, ILoggerFactory loggerFactory, IDirectoryItemService directoryItemService, IWebHostEnvironment webHostEnvironment) : base(service, aPILogService, loggerFactory)
        {
            _directoryItemService = directoryItemService;
            _logger = loggerFactory.CreateLogger<FileManagerController>();
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("api/get-info")]     
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

        [HttpGet("api/list-folder")]
        public async Task<IActionResult> ListFolder()
        {
            try
            {
                var res = await _directoryItemService.List(true);
                return Ok(res);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Some thing wrong when Task<IActionResult> ListFolder()");
                return BadRequest();
            }
        }
        [HttpPost("api/list-server-side")]
        public async Task<IActionResult> ListServerSide([FromBody] DTFileManagerParameters parameters)
        {
            try
            {
                var res = await _directoryItemService.List(parameters);
                return Ok(res);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Something wrong when ListServerSide([FromBody] DTFileManagerParameters parameters)");
                return BadRequest();
            }
        }
        [HttpGet("api/detail/{id}")]
        public async Task<IActionResult> Detail(int id)
        {
            try
            {
                var res = await _directoryItemService.GetByIdAsync(id);
                return Ok(res);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Some thing wrong when Task<IActionResult> Detail(int id)");
                return BadRequest();
            }
        }

        [HttpPost("api/upload")]
        public async Task<IActionResult> Upload([FromForm] UploadingFileDTO file)
        {
            try
            {
                var res =  await _directoryItemService.Upload(file);
                return Ok(res);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Something wrong when upload chunk file");
                return BadRequest();
            }

        }

    }
}
