using BaseMetronic.Models.Entities;
using BaseMetronic.Repositories.Common;
using BaseMetronic.Repositories.Interface;
using BaseMetronic.ViewModels.FileManagers;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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

        public async Task<List<DirectoryItemDetail>> List(bool isOnlyFolder = false)
        {
            var data = new List<DirectoryItemDetail>();
            var parents = await _context.DirectoryItems.Where(c => c.Active && c.ParentId == null && (!isOnlyFolder || c.IsDirectory)).Select(c => new DirectoryItemDetail()
            {
                Id = c.Id,
                IsDirectory = c.IsDirectory,
                Name = c.Name,
                ParentId = c.ParentId,
                Path = c.Path
            }).ToListAsync();

            if (parents.Count > 0)
            {
                data.AddRange(parents);
                parents = parents.Where(c => c.IsDirectory).ToList();
                for (int i = 0; i < parents.Count; i++)
                {
                    var item = parents[i];
                    var childs = await ListChild(item.Id, isOnlyFolder);
                    if (childs.Count > 0)
                    {
                        data.AddRange(childs);
                        List<DirectoryItemDetail> newParents = childs.Where(c => c.IsDirectory).ToList();
                        parents.AddRange(newParents);
                    }
                }
            }
            var sortedData = SortItems(data);
            return sortedData;
        }
        public async Task<List<DirectoryItemDetail>> ListChild(int parentId, bool isOnlyFolder = false)
        {   
            var childrens = await _context.DirectoryItems
                .Where(c => c.Active && c.ParentId == parentId && (!isOnlyFolder || c.IsDirectory))
                .Select(c => new DirectoryItemDetail()
                {
                    Id = c.Id,
                    IsDirectory = c.IsDirectory,
                    Name = c.Name,
                    ParentId = c.ParentId,
                    Path = c.Path
                }).ToListAsync();
            return childrens;
        }
        public List<DirectoryItemDetail> SortItems(List<DirectoryItemDetail> items)
        {
            // Đầu tiên, sắp xếp các mục theo TreeIds và tên
            // Đầu tiên, sắp xếp các mục theo TreeIds
            var sortedItems = items.ToList();

            // Thêm một danh sách để chứa kết quả sắp xếp theo cây
            var sortedByHierarchy = new List<DirectoryItemDetail>();

            // Sắp xếp theo cấu trúc cây
            void AddItemsToHierarchy(IEnumerable<DirectoryItemDetail> itemsToAdd, int? parentId)
            {
                // Đầu tiên, lấy các mục con
                var children = itemsToAdd.Where(i => i.ParentId == parentId)
                                          .OrderBy(i => i.Name) // Sắp xếp các mục con theo tên
                                          .ToList();

                foreach (var item in children)
                {
                    sortedByHierarchy.Add(item); // Thêm mục vào danh sách đã sắp xếp
                                                 // Đệ quy thêm các mục con
                    AddItemsToHierarchy(itemsToAdd, item.Id);
                }
            }

            // Thêm các mục gốc vào danh sách
            AddItemsToHierarchy(sortedItems, null);

            return sortedByHierarchy;
        }
    }
}
