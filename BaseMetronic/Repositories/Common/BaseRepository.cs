using BaseMetronic.Models.Common;
using BaseMetronic.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace BaseMetronic.Repositories.Common
{
    /// <summary>
    /// Created: 22/09/2024
    /// Author TUNGTD
    /// Description: Repository base
    /// </summary>
    /// <typeparam name="T">Type of entity</typeparam>
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        private readonly CRMContext _context;

        public BaseRepository(CRMContext context)
        {
            _context = context;
        }

        public async Task AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
           return await _context.Set<T>().ToListAsync();
        }

        public async Task<T?> GetByIdAsync(params object[] key)
        {
            return await _context.Set<T>().FindAsync(key);
        }

        public DatabaseFacade GetDatabase()
        {
            return _context.Database;
        }

        public async Task<bool> UpdateAsync(T entity)
        {
            _context.Set<T>().Update(entity);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
