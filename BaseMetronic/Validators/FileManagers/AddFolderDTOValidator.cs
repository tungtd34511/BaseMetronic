using BaseMetronic.Constants;
using BaseMetronic.ViewModels.FileManagers;
using FluentValidation;

namespace BaseMetronic.Validators.FileManagers
{
    public class AddFolderDTOValidator : AbstractValidator<AddFolderDTO>
    {
        public AddFolderDTOValidator()
        {
            RuleFor(c => c.Name).NotEmpty().WithMessage("Tên thư mục không được để trống!")
                .Matches(c => SystemConstant.Regexp.DirectoryItem).WithMessage("Tên thư mục không chứa các ký tự đặc biệt như: /, \\, :, *, ?, \", <, >, |, khoảng trắng ở đầu và cuối tên và có độ dài giới hạn là 255 ký tự.");
        }
    }
}
