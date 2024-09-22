using BaseMetronic.Models.Entities;
using BaseMetronic.Repositories.Common;
using BaseMetronic.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace BaseMetronic.Repositories.Implement
{
    public class AccountRepository : BaseRepository<Account>, IAccountRepository
    {
        public AccountRepository(CRMContext context) : base(context)
        {
        }

        public async Task<Account?> Authenticate(string userName, string hashPass)
        {
            return await _context.Accounts.FirstOrDefaultAsync(c => c.Active && (c.UserName == userName || c.Email == userName) && c.Password == hashPass);
        }

        public bool IsExistedEmail(string email)
        {
            return _context.Accounts.Any(c => c.Active && c.Email == email);
        }
    }
}
