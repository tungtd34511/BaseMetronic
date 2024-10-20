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
        public string? Extension { get; set; }
        public int? ParentId { get; set; }
        public int? AuthorId { get; set; }
        /// <summary>
        /// Đường dẫn ảnh bìa
        /// </summary>
        public string? ThumbnailPath { get; set; }
        /// <summary>
        /// Loại tệp tin
        /// </summary>
        public string? MimeType { get; set; } = string.Empty;
        [JsonIgnore]
        public virtual Account? Account { get; set; }
        [JsonIgnore]
        public virtual DirectoryItem? ParentItem { get; set; }
        [JsonIgnore]
        public virtual ICollection<DirectoryItem> ChildrenItems { get; set; } = new List<DirectoryItem>();
    }
}
