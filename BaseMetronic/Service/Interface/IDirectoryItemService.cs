using BaseMetronic.Models.Entities;
using BaseMetronic.Service.Common;
using BaseMetronic.Utilities;
using BaseMetronic.Utilities.Datatables;
using BaseMetronic.ViewModels.FileManagers;

namespace BaseMetronic.Service.Interface
{
    public interface IDirectoryItemService : IBaseService<DirectoryItem>
    {
        Task<DionResponse> GetInfo();
        Task<DionResponse> AddFolder(AddFolderDTO model);
        Task<DionResponse> List(DirectoryItemRequest request);
        Task<DionResponse> RenameFolder(RenameDirectoryItemDTO model);
        Task<DionResponse> List(bool isOnlyFolder = false);
        Task<DTResult<DirectoryItemDetail>> List(DTFileManagerParameters parameters);
        Task<DionResponse> Upload(UploadingFileDTO model);
    }
}
