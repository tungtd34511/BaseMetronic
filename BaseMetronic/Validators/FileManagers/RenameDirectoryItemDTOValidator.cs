using BaseMetronic.Constants;
using BaseMetronic.ViewModels.FileManagers;
using FluentValidation;

namespace BaseMetronic.Validators.FileManagers
{
    public class RenameDirectoryItemDTOValidator : AbstractValidator<RenameDirectoryItemDTO>
    {
        public RenameDirectoryItemDTOValidator()
        {
            RuleFor(c => c.Id).NotEmpty().WithMessage("Mã không được để trống");
            RuleFor(c => c.Name).NotEmpty().WithMessage("Tên không được để trống")
                .Matches(SystemConstant.Regexp.DirectoryItem)
                .WithMessage("Tên không được chứa các ký tự đặc biệt như: /, \\, :, *, ?, \", <, >, |, khoảng trắng ở đầu và cuối tên và có độ dài giới hạn là 255 ký tự.");
        }
    }
}
