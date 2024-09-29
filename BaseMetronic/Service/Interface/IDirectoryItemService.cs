using BaseMetronic.Models.Entities;
using BaseMetronic.Service.Common;
using BaseMetronic.Utilities;
using BaseMetronic.ViewModels.FileManagers;

namespace BaseMetronic.Service.Interface
{
    public interface IDirectoryItemService : IBaseService<DirectoryItem>
    {
        Task<DionResponse> GetInfo();
        Task<DionResponse> AddFolder(AddFolderDTO model);
        Task<DionResponse> List(DirectoryItemRequest request);
    }
}
