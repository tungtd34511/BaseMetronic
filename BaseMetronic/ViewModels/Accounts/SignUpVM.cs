namespace BaseMetronic.ViewModels.Accounts
{
    public class SignUpVM
    {
        public string FirstName { get; set; } = null!;
        public string MiddleName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string FullName { get { return string.Join(" ", FirstName.Trim(), MiddleName.Trim(), LastName.Trim()); } }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string ConfirmPassword { get; set; } = null!;
        public bool Toc { get; set; }
    }
}
