using BaseMetronic.Models.Common;
using Newtonsoft.Json;

namespace BaseMetronic.Models.Entities
{
    public class DirectoryItem : EntityCommon<int>
    {
        public long? Size { get; set; }
        public DateTime? LastModified { get; set; }
        public string Path { get; set; } = string.Empty;
        public bool IsDirectory { get; set; }
        public int? ParentId { get; set; }
        public int? AuthorId { get; set; }
        [JsonIgnore]
        public virtual Account? Account { get; set; }
        [JsonIgnore]
        public virtual DirectoryItem? ParentItem { get; set; }
        [JsonIgnore]
        public virtual ICollection<DirectoryItem> ChildrenItems { get; set; } = new List<DirectoryItem>();
    }
}
