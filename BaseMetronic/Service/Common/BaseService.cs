using BaseMetronic.Models.Common;
using BaseMetronic.Repositories.Common;
using BaseMetronic.Utilities;

namespace BaseMetronic.Service.Common
{
    public class BaseService<T> : IBaseService<T> where T : class
    {
        private readonly IBaseRepository<T> _repository;

        public BaseService(IBaseRepository<T> repository)
        {
            _repository = repository;
        }

        public async Task<DionResponse> AddAsync(T entity)
        {
            await _repository.AddAsync(entity);
            return DionResponse.Success(entity);
        }

        public async Task<DionResponse> GetAllAsync()
        {
            var data = await _repository.GetAllAsync();
            return DionResponse.Success(data);
        }

        public async Task<DionResponse> GetByIdAsync(params object[] id)
        {
            var data = await _repository.GetByIdAsync(id);
            return DionResponse.Success(data);
        }

        public async Task<DionResponse> UpdateAsync(T entity)
        {
            bool status = await _repository.UpdateAsync(entity);
            if (status)
            {
                return DionResponse.Success(entity);
            }
            return DionResponse.BadRequest();
        }
    }
}
