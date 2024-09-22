namespace BaseMetronic.Constants
{
    public class SystemConstant
    {
        public struct Authorization
        {
            public const string Scheme = "Authorization";
        }
        public struct Regexp
        {
            /// <summary>
            /// Mật khẩu có độ dài tối thiểu là 8 ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.
            /// </summary>
            public const string Password = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;""'<>,.?~`-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;""'<>,.?~`-]{8,}$";
        }
    }
}
