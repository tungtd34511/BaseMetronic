using BaseMetronic.Constants;
using BaseMetronic.Models.Entities;
using BaseMetronic.Repositories.Common;
using BaseMetronic.Repositories.Interface;
using BaseMetronic.Service.Common;
using BaseMetronic.Service.Interface;
using BaseMetronic.Utilities;
using BaseMetronic.Utilities.Datatables;
using BaseMetronic.Utilities.Extensions;
using BaseMetronic.ViewModels.FileManagers;
using Microsoft.AspNetCore.SignalR;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Processing;
using System.IO;

namespace BaseMetronic.Service.Implement
{
    public class DirectoryItemService : BaseService<DirectoryItem>, IDirectoryItemService
    {
        private readonly IDirectoryItemRepository _directoryItemRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _uploadTempPath;
        private readonly string _rootPath;
        public DirectoryItemService(IBaseRepository<DirectoryItem> repository, IDirectoryItemRepository directoryItemRepository, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor) : base(repository)
        {
            _directoryItemRepository = directoryItemRepository;
            _webHostEnvironment = webHostEnvironment;
            _httpContextAccessor = httpContextAccessor;
            _uploadTempPath = Path.Combine(_webHostEnvironment.WebRootPath, SystemConstant.FileStorage.ROOT_WEB_NAME, "temp");
            _rootPath = Path.Combine(_webHostEnvironment.WebRootPath, SystemConstant.FileStorage.ROOT_WEB_NAME);
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
                        Path = folderFullName.Replace(rootFolderPath, "").GetWebFormatPath(),
                        AuthorId = _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated ? _httpContextAccessor.HttpContext.GetLoggedInUserId() : null,
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
        public async Task<DTResult<DirectoryItemDetail>> List(DTFileManagerParameters parameters)
        {
            return await _directoryItemRepository.List(parameters);
        }

        public async Task<DionResponse> Upload(UploadingFileDTO model)
        {
            
            if (model.Chunk == null || model.Chunk.Length == 0)
                throw new Exception("Invalid chunk.");
            if (!Directory.Exists(_uploadTempPath))
            {
                Directory.CreateDirectory(_uploadTempPath);
            }

            var tempFilePath = Path.Combine(_uploadTempPath, $"{model.FileName}.part_{model.ChunkIndex}_{model.LocalTime}");

            // Save the chunk
            using (var stream = new FileStream(tempFilePath, FileMode.Create))
            {
                await model.Chunk.CopyToAsync(stream);
            }

            // Check if all chunks are uploaded
            if (model.ChunkIndex + 1 == model.TotalChunks)
            {
                await CombineChunks(model);
            }
            return DionResponse.Success($"Chunk {model.ChunkIndex + 1} uploaded successfully.");
        }

        private async Task CombineChunks(UploadingFileDTO model)
        {
            var _uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, SystemConstant.FileStorage.ROOT_WEB_NAME);
            if (model.ParentId!= null)
            {
                var directory = await _directoryItemRepository.GetByIdAsync(model.ParentId);
                if (directory != null)
                {
                    _uploadPath = Path.Combine(_rootPath + directory.Path.GetFolderFormatPath());
                }
            }
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
            var path = Path.Combine(_uploadPath, model.FileName);
            int count = 1;
            string fileNameOnly = Path.GetFileNameWithoutExtension(path);
            string extension = Path.GetExtension(path);
            string newFullPath = path;
            string newFileName = fileNameOnly;
            string thumbPath = "";
            while (File.Exists(newFullPath))
            {
                newFileName = string.Format("{0}({1})", fileNameOnly, count++);
                newFullPath = Path.Combine(_uploadPath, newFileName + extension);
            }
            if (SystemConstant.FileStorage.ImgExtensions.Contains(extension))
            {
                var finalStream = new MemoryStream();

                for (int i = 0; i < model.TotalChunks; i++)
                {
                    var chunkPath = Path.Combine(_uploadTempPath, $"{model.FileName}.part_{i}_{model.LocalTime}");

                    using (var chunkStream = new FileStream(chunkPath, FileMode.Open, FileAccess.Read))
                    {
                        await chunkStream.CopyToAsync(finalStream);
                    }

                    // Xóa chunk sau khi đã sao chép thành công
                    File.Delete(chunkPath);
                }
                // Đặt lại con trỏ về đầu stream
                finalStream.Position = 0;
                using (var image = Image.Load(finalStream))
                {
                    if (image.Width > SystemConstant.FileStorage.MAXIMUM_IMAGE_WIDTH)//resize file img
                    {
                        float scale = image.Width / SystemConstant.FileStorage.MAXIMUM_IMAGE_WIDTH;
                        int newHeight = (int)MathF.Ceiling(image.Height / scale);
                        image.Mutate(h => h.Resize(new Size((int)SystemConstant.FileStorage.MAXIMUM_IMAGE_WIDTH, newHeight)));
                    }
                    await image.SaveAsync(newFullPath);
                    thumbPath = await CreateThumbnail(newFullPath, image);
                    thumbPath = thumbPath.Replace(_webHostEnvironment.WebRootPath, "").Replace(@"\", "/");
                }
            }
            else
            {
                using (var finalStream = new FileStream(newFullPath, FileMode.Create))
                {
                    for (int i = 0; i < model.TotalChunks; i++)
                    {
                        var chunkPath = Path.Combine(_uploadTempPath, $"{model.FileName}.part_{i}_{model.LocalTime}");
                        using (var chunkStream = new FileStream(chunkPath, FileMode.Open))
                        {
                            await chunkStream.CopyToAsync(finalStream);
                        }
                        // Delete chunk after combining
                        File.Delete(chunkPath);
                    }
                }
            }
            FileInfo fileInfo = new FileInfo(newFullPath);
            var file = new DirectoryItem()
            {
                Size = fileInfo.Length,
                ParentId = model.ParentId,
                AuthorId = _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated ? _httpContextAccessor.HttpContext.GetLoggedInUserId():null,
                Active = true,
                CreatedTime = DateTime.Now,
                Extension = fileInfo.Extension,
                Name = fileInfo.Name,
                Path = newFullPath.Replace(GetRootFolderPath(), "").Replace(@"\", "/"),
                MimeType = SystemConstant.FileStorage.GetMimeType(extension),
                ThumbnailPath = string.IsNullOrEmpty(thumbPath) ? SystemConstant.FileStorage.DEFAULT_THUMB : thumbPath,
                LastModified = fileInfo.LastWriteTime,
                IsDirectory = false
            };
            await _directoryItemRepository.AddAsync(file);
        }

        /// <summary>
        /// Author: TUNGTD
        /// Created: 30//0
        /// Description: Created thumbnail
        /// </summary>
        /// <param name="filePath">file image full path</param>
        /// <param name="image">image</param>
        public async Task<string> CreateThumbnail(string filePath, Image image)//funciton only run in using stream or file
        {
            string rootPath = Path.Combine(Path.GetDirectoryName(filePath)??"", SystemConstant.FileStorage.FOLDER_THUMB_NAME);
            string fileName = Path.GetFileName(filePath);
            var newFullPath = Path.Combine(rootPath, fileName);
            string newThumbName = fileName;
            string newThumnailsPath = newFullPath;
            Image thumb = image;
            int count = 1;
            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }
            if (thumb.Width > SystemConstant.FileStorage.MAXIMUN_THUMB_WIDTH)
            {
                float scale = (image.Width) / SystemConstant.FileStorage.MAXIMUN_THUMB_WIDTH;
                int newHeight = (int)MathF.Ceiling(thumb.Height /scale);
                thumb.Mutate(h => h.Resize(new Size((int)SystemConstant.FileStorage.MAXIMUN_THUMB_WIDTH, newHeight)));
            }
            while (File.Exists(newFullPath))
            {
                newThumbName = string.Format("{0}({1})", newThumbName, count++);
                newThumnailsPath = Path.Combine(rootPath, newThumbName);
            }
            await thumb.SaveAsync(newThumnailsPath);
            return newThumnailsPath;
        }
    }
}
