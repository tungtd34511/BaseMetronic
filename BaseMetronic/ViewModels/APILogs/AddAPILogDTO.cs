namespace BaseMetronic.ViewModels.APILogs
{
    public class AddAPILogDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int StatusCode { get; set; }
        public int? AccountId { get; set; }
    }
}
