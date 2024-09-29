using BaseMetronic.Models.Entities;
using BaseMetronic.Repositories.Common;
using BaseMetronic.ViewModels.FileManagers;

namespace BaseMetronic.Repositories.Interface
{
    public interface IDirectoryItemRepository : IBaseRepository<DirectoryItem>
    {
        Task<FileManagerInfoVM> GetInfo();
        Task<DirectoryItemResponse> List(DirectoryItemRequest request);
    }
}
