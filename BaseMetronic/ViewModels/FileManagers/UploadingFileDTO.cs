using Microsoft.AspNetCore.Mvc;

namespace BaseMetronic.ViewModels.FileManagers
{
    public class UploadingFileDTO
    {
        public IFormFile Chunk { get; set; }
        public string FileName { get; set; }
        public int ChunkIndex { get; set; }
        public int TotalChunks { get; set; }
        public int? ParentId { get; set; }
        public long? LocalTime { get; set; }
    }
}
