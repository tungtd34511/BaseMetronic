using BaseMetronic.Models.Common;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace BaseMetronic.Repositories.Common
{
    /// <summary>
    /// Created: 22/09/2024
    /// Author TUNGTD
    /// Description: IRepository base
    /// </summary>
    /// <typeparam name="T">Type of entity</typeparam>
    public interface IBaseRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(params object[] key);
        Task AddAsync(T entity);
        Task<bool> UpdateAsync(T entity);
        DatabaseFacade GetDatabase();
    }
}
