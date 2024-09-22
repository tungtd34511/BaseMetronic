namespace BaseMetronic.ViewModels.Accounts
{
    public class SignInResponse
    {
        public string Token { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string AccountFullName { get; set; } = null!;
    }
}
