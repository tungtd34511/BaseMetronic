using BaseMetronic.Models.Common;
using BaseMetronic.Utilities;

namespace BaseMetronic.Service.Common
{
    /// <summary>
    /// Created: 22/09/2024
    /// Author TUNGTD
    /// Description: IService base
    /// </summary>
    /// <typeparam name="T">Type of entity</typeparam>
    public interface IBaseService<T> where T : class
    {
        Task<DionResponse> GetAllAsync();
        Task<DionResponse> GetByIdAsync(params object[] id);
        Task<DionResponse> AddAsync(T entity);
        Task<DionResponse> UpdateAsync(T entity);
    }
}
