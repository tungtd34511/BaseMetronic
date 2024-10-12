using BaseMetronic.Constants;
using BaseMetronic.Models.Entities;
using BaseMetronic.Repositories.Common;
using BaseMetronic.Repositories.Interface;
using BaseMetronic.Service.Common;
using BaseMetronic.Service.Interface;
using BaseMetronic.Utilities;
using BaseMetronic.Utilities.Extensions;
using BaseMetronic.ViewModels.FileManagers;
using Microsoft.IdentityModel.Tokens;

namespace BaseMetronic.Service.Implement
{
    public class DirectoryItemService : BaseService<DirectoryItem>, IDirectoryItemService
    {
        private readonly IDirectoryItemRepository _directoryItemRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public DirectoryItemService(IBaseRepository<DirectoryItem> repository, IDirectoryItemRepository directoryItemRepository, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor) : base(repository)
        {
            _directoryItemRepository = directoryItemRepository;
            _webHostEnvironment = webHostEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<DionResponse> AddFolder(AddFolderDTO model)
        {
            DirectoryItem? parent = null;
            List<string> errors = new();
            string rootFolderPath = GetRootFolderPath();
            if (model.ParentId != null)
            {
                parent = await _directoryItemRepository.GetByIdAsync(model.ParentId);
                if (parent == null || !parent.IsDirectory)
                {
                    errors.Add("Mã thư mục cha không chính xác.");
                    return DionResponse.BadRequest("Thêm mới thư mục không thành công",errors);
                }
            }
            string folderFullName = parent != null ? Path.Combine(rootFolderPath + parent.Path.GetFolderFormatPath(), model.Name) : Path.Combine(rootFolderPath, model.Name);
            folderFullName = folderFullName.GetValidFolderName();
            using(var tran = await _directoryItemRepository.GetDatabase().BeginTransactionAsync())
            {
                try
                {
                    DirectoryItem obj = new()
                    {
                        Active = true,
                        CreatedTime = DateTime.Now,
                        Name = Path.GetFileName(folderFullName),
                        ParentId = model.ParentId,
                        Path = folderFullName.Replace(rootFolderPath, "").GetWebFormatPath(),AuthorId = _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated ? _httpContextAccessor.HttpContext.GetLoggedInUserId() : null,
                        IsDirectory = true
                    };
                    if (!Directory.Exists(folderFullName))
                    {
                        Directory.CreateDirectory(folderFullName);
                    }
                    await _directoryItemRepository.AddAsync(obj);
                    await tran.CommitAsync();
                    return DionResponse.Success(obj, "Thêm mới thư mục thành công!");
                }
                catch (Exception e)
                {
                    await tran.RollbackAsync();
                    errors.Add(e.Message);
                    return DionResponse.BadRequest("Thêm mới thư mục không thành công!", errors);
                }
            }
        }

        public async Task<DionResponse> GetInfo()
        {
            var info = await _directoryItemRepository.GetInfo();
            return DionResponse.Success(info);
        }

        public async Task<DionResponse> List(DirectoryItemRequest request)
        {
            var data = await _directoryItemRepository.List(request);
            return DionResponse.Success(data);
        }

        public async Task<DionResponse> RenameFolder(RenameDirectoryItemDTO model)
        {
            var item = await _directoryItemRepository.GetByIdAsync(model.Id);
            if(item == null)
            {
                throw new Exception("Not found folder");
            }
            if(item.Name != model.Name)
            {
                string rootFolderPath = GetRootFolderPath();
                string folderFullName = string.Join("",rootFolderPath.GetFolderFormatPath(), item.Path);
                string folderParentName = Path.GetDirectoryName(folderFullName)?? string.Empty;
                folderFullName = Path.Combine(folderParentName, model.Name);
                folderFullName = folderFullName.GetValidFolderName();
                string newFolderName = Path.GetFileName(folderFullName);
                item.Name = newFolderName;
                await _directoryItemRepository.UpdateAsync(item);
            }
            return DionResponse.Success("Đổi tên thư mục thành công!");
        }

        /// <summary>
        /// Author: TUNGTD
        /// Created: 30/07/2023
        /// Description: Get root web folder in storage
        /// </summary>
        /// <returns></returns>
        private string GetRootFolderPath()
        {
            string rootPath = _webHostEnvironment.WebRootPath;
            rootPath = Path.Combine(rootPath, SystemConstant.FileStorage.ROOT_WEB_NAME);
            return rootPath;
        }
        public async Task<DionResponse> List(bool isOnlyFolder = false)
        {
            var data = await _directoryItemRepository.List(isOnlyFolder);
            return DionResponse.Success(data);
        }
    }
}
