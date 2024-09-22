using BaseMetronic.Constants;
using BaseMetronic.Repositories.Interface;
using BaseMetronic.ViewModels.Accounts;
using FluentValidation;

namespace BaseMetronic.Validators.Accounts
{
    public class SignUpVMValidator : AbstractValidator<SignUpVM>
    {
        private readonly IAccountRepository _accountRepository;
        public SignUpVMValidator(IAccountRepository accountRepository)
        {
            RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("Họ không được để trống");

            RuleFor(x => x.LastName)
                .NotEmpty()
                .WithMessage("Tên không được để trống");

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Địa chỉ email không được để trống")
                .EmailAddress()
                .WithMessage("Địa chỉ email không chính xác")
                .Must(c => !accountRepository.IsExistedEmail(c))
                .WithMessage("Địa chỉ email đã được sử dụng");

            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("Mật khẩu không được để trống")
                .Matches(SystemConstant.Regexp.Password)
                .WithMessage("Vui lòng nhập mật khẩu đúng định dạng");

            RuleFor(x => x.ConfirmPassword)
                .NotEmpty()
                .WithMessage("Mật khẩu xác nhận không được để trống")
                .Equal(x => x.Password)
                .WithMessage("Mật khẩu và mật khẩu xác nhận không giống nhau");

            RuleFor(x => x.Toc)
                .Equal(true)
                .WithMessage("Bạn phải đồng ý với chính xác và điều khoản");
            _accountRepository = accountRepository;
        }
    }
}
