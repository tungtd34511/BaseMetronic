using BaseMetronic.Models.Common;

namespace BaseMetronic.Models.Entities
{
    public class DirectoryItem : EntityCommon<int>
    {
        public long? Size { get; set; }
        public DateTime? LastModified { get; set; }
        public string Path { get; set; } = string.Empty;
        public bool IsDirectory { get; set; }
        public int? ParentId { get; set; }
        public string TreeIds { get; set; } = string.Empty;
        public int? AuthorId { get; set; }
        public virtual Account? Account { get; set; }
        public virtual DirectoryItem? ParentItem { get; set; }
        public virtual ICollection<DirectoryItem> ChildrenItems { get; set; } = new List<DirectoryItem>();
    }
}
