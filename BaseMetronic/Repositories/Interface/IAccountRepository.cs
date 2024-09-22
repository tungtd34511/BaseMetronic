using BaseMetronic.Models.Entities;
using BaseMetronic.Repositories.Common;

namespace BaseMetronic.Repositories.Interface
{
    public interface IAccountRepository : IBaseRepository<Account>
    {
        bool IsExistedEmail(string email);
        Task<Account?> Authenticate(string userName, string hashPass);
    }
}
