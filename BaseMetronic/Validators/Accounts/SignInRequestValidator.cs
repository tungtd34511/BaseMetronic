using BaseMetronic.ViewModels.Accounts;
using FluentValidation;

namespace BaseMetronic.Validators.Accounts
{
    public class SignInRequestValidator : AbstractValidator<SignInRequest>
    {
        public SignInRequestValidator()
        {
            RuleFor(c => c.Email).NotEmpty().WithMessage("Địa chỉ email không được để trống")
                .EmailAddress().WithMessage("Địa chỉ email không đúng định dạng");
            RuleFor(c => c.Password).NotEmpty().WithMessage("Mật khẩu không được để trống");
        }
    }
}
