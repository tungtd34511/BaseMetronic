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
            /// <summary>
            /// Tên thư mục không chứa các ký tự đặc biệt như: /, \\, :, *, ?, ", <, >, |, khoảng trắng ở đầu và cuối tên và có độ dài giới hạn là 255 ký tự.
            /// </summary>
            public const string DirectoryItem = @"^(?!\s)(?!.*[\\/:\*\?""<>\|]).{1,255}(?<!\s)$";
        }
        public struct ClaimNames
        {
            public const string USER_NAME = "USER_NAME";
            public const string ID = "ID";
            public const string ROLE_ID = "ROLE_ID";
        }
        public struct FileStorage
        {
            /// <summary>
            /// Tên thư mục chứa các tệp và file tải lên
            /// </summary>
            public const string ROOT_WEB_NAME = "upload";
        }
    }
}
