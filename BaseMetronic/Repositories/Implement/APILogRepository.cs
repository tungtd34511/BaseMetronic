using BaseMetronic.Models.Entities;
using BaseMetronic.Repositories.Common;
using BaseMetronic.Repositories.Interface;

namespace BaseMetronic.Repositories.Implement
{
    public class APILogRepository : BaseRepository<APILog>, IAPILogRepository
    {
        private readonly CRMContext _context;
        public APILogRepository(CRMContext context) : base(context)
        {
            _context = context;
        }
    }
}
