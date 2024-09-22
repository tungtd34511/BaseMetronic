using BaseMetronic.Models.Entities;
using BaseMetronic.Repositories.Interface;
using BaseMetronic.Service.Common;
using BaseMetronic.Service.Interface;
using BaseMetronic.Utilities;
using BaseMetronic.Utilities.Extensions;
using BaseMetronic.ViewModels.Accounts;

namespace BaseMetronic.Service.Implement
{
    public class AccountService : BaseService<Account>, IAccountService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly ITokenService _tokenService;
        public AccountService(IAccountRepository accountRepository, ITokenService tokenService) : base(accountRepository)
        {
            _accountRepository = accountRepository;
            _tokenService = tokenService;
        }

        public async Task<DionResponse> Authenticate(SignInRequest model)
        {
            var account = await _accountRepository.Authenticate(model.Email, model.Password.ToSHA256());
            if(account!= null)
            {
                return DionResponse.Success(new SignInResponse()
                {
                    Token = _tokenService.GenerateToken(account),
                    AccountFullName = account.FullName
                });
            }
            else
            {
                return DionResponse.BadRequest( new string[]{"Tài khoản hoặc mật khẩu không chính xác"});
            }
        }

        public async Task<DionResponse> SignUp(SignUpVM model)
        {
            var account = new Account()
            {
                Active = true,
                CreatedTime = DateTime.Now,
                FirstName = model.FirstName,
                Email = model.Email,
                FullName = model.FullName,
                LastName = model.LastName,
                MiddleName = model.MiddleName,
                Password = model.Password.ToSHA256(),
                UserName = model.Email
            };
            return await AddAsync(account);
        }
    }
}
