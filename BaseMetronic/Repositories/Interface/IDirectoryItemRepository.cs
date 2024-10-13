using BaseMetronic.Models.Entities;
using BaseMetronic.Repositories.Common;
using BaseMetronic.Utilities.Datatables;
using BaseMetronic.ViewModels.FileManagers;

namespace BaseMetronic.Repositories.Interface
{
    public interface IDirectoryItemRepository : IBaseRepository<DirectoryItem>
    {
        Task<FileManagerInfoVM> GetInfo();
        Task<DirectoryItemResponse> List(DirectoryItemRequest request);
        Task<List<DirectoryItemDetail>> List(bool isOnlyFolder = false);
        Task<DTResult<DirectoryItemDetail>> List(DTFileManagerParameters parameters);
    }
}
