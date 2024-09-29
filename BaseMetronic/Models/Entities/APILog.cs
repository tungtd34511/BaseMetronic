using BaseMetronic.Models.Common;

namespace BaseMetronic.Models.Entities
{
    public class APILog : EntityBase<int>
    {
        public string Title { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int StatusCode { get; set; }
        public int? AccountId { get; set; }
        public Account? Account { get; set; }
    }
}
