using BaseMetronic.Models.Entities;
using BaseMetronic.Repositories.Common;
using BaseMetronic.Repositories.Interface;
using BaseMetronic.ViewModels.FileManagers;
using Microsoft.EntityFrameworkCore;

namespace BaseMetronic.Repositories.Implement
{
    public class DirectoryItemRepository : BaseRepository<DirectoryItem>, IDirectoryItemRepository
    {
        private readonly CRMContext _context;
        public DirectoryItemRepository(CRMContext context) : base(context)
        {
            _context = context;
        }

        public async Task<FileManagerInfoVM> GetInfo()
        {
            return new FileManagerInfoVM()
            {
                Length = await _context.DirectoryItems.SumAsync(c => c.Size) ?? 0,
                RecordTotal = await _context.DirectoryItems.CountAsync()
            };
        }

        public async Task<DirectoryItemResponse> List(DirectoryItemRequest request)
        {
            var parents = new List<DirectoryItemDetail>();
            if (request.ParentId != null)
            {
                int? parentId = request.ParentId;
                while(parentId != null)
                {
                    var detail = await Detail(parentId);
                    parents.Add(detail);
                    parentId = detail.ParentId;
                }
            }
            List<DirectoryItemDetail> childs = await (from i in _context.DirectoryItems
                                                      where i.Active && ((request.ViewMode == DirectoryItemRequest.Mode.OnlyFolder && i.IsDirectory)
                                                      || request.ViewMode == DirectoryItemRequest.Mode.All) &&
                                                      i.ParentId == request.ParentId
                                                      select new DirectoryItemDetail()
                                                      {
                                                          Id = i.Id,
                                                          Name = i.Name,
                                                          Path = i.Path,
                                                          ParentId = i.ParentId
                                                      }).ToListAsync();
            return new DirectoryItemResponse()
            {
                Childrens = childs,
                Parents = parents
            };
        }

        public async Task<DirectoryItemDetail> Detail(int? id)
        {
            var detail = await _context.DirectoryItems.Where(c => c.Active && c.Id == id).Select(c => new DirectoryItemDetail()
            {
                Id = c.Id,
                Name = c.Name,
                Path = c.Path,
                ParentId = c.ParentId
            }).FirstAsync();
            return detail;
        }
    }
}
