using BaseMetronic.Models.Entities;
using BaseMetronic.Service.Common;
using BaseMetronic.Utilities;
using BaseMetronic.ViewModels.Accounts;

namespace BaseMetronic.Service.Interface
{
    public interface IAccountService : IBaseService<Account>
    {
        Task<DionResponse> SignUp(SignUpVM model);
        Task<DionResponse> Authenticate(SignInRequest signInRequest);
    }
}
