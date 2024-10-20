namespace BaseMetronic.ViewModels.FileManagers
{
    public class DirectoryItemDetail
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public bool IsDirectory { get; set; }
        public long? Size { get; set; }
        public string? MimeType { get; set; }
        public string? ThumbnailPath { get; set; }
        public string? Extension { get; set; }
    }
    public class DirectoryItemResponse
    {
        public List<DirectoryItemDetail> Parents { get; set; } = new List<DirectoryItemDetail>();
        public List<DirectoryItemDetail> Childrens { get; set; } = new List<DirectoryItemDetail>();
    }
}
