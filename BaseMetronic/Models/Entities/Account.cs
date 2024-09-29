using BaseMetronic.Models.Common;

namespace BaseMetronic.Models.Entities
{
    public class Account : EntityBase<int>
    {
        public string FirstName { get; set; } = string.Empty;
        public string MiddleName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Photo { get; set; } = string.Empty;
        public virtual ICollection<APILog> APILogs { get; set; } = new List<APILog>();
        public virtual ICollection<DirectoryItem> DirectoryItems { get; set; } = new List<DirectoryItem>();
    }
}
