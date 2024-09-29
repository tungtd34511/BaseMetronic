namespace BaseMetronic.ViewModels.FileManagers
{
    public class DirectoryItemRequest
    {
        public struct Mode
        {
            public const string All = "all";
            public const string OnlyFolder = "onlyFolder";
        }
        public string ViewMode { get; set; } = Mode.All;
        public int? ParentId { get; set; } 
    }
}
