using BaseMetronic.Models.Common;
using BaseMetronic.Repositories.Common;
using BaseMetronic.Utilities;

namespace BaseMetronic.Service.Common
{
    public class BaseService<T> : IBaseService<T> where T : EntityBase<int>
    {
        private readonly IBaseRepository<T> _repository;

        public BaseService(IBaseRepository<T> repository)
        {
            _repository = repository;
        }
        public async Task<DionResponse> AddAsync(T entity)
        {
            await _repository.AddAsync(entity);
            return DionResponse.Success(entity, "Thêm mới dữ liệu thành công!");
        }
        /// <summary>
        /// Author: TUNGTD
        /// CreatedDate: 28/09/2024
        /// Description: Service base delete entity item;
        /// </summary>
        /// <returns></returns>
        public async Task<DionResponse> DeleteAsync(params object[] id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if(entity != null)
            {
                entity.Active = false;
                bool status = await _repository.UpdateAsync(entity);
                if (status)
                {
                    return DionResponse.Success(entity, "Xóa dữ liệu thành công!");
                }
                return DionResponse.BadRequest("Xóa dữ liệu thất bại!");
            }
            else
            {
                return DionResponse.NotFound("Xóa dữ liệu thất bại!");
            }
        }

        public async Task<DionResponse> GetAllAsync()
        {
            var data = await _repository.GetAllAsync();
            return DionResponse.Success(data, "Lấy dữ liệu thành công!");
        }

        public async Task<DionResponse> GetByIdAsync(params object[] id)
        {
            var data = await _repository.GetByIdAsync(id);
            return DionResponse.Success(data,"Lấy dữ liệu thành công!");
        }

        public async Task<DionResponse> UpdateAsync(T entity)
        {
            bool status = await _repository.UpdateAsync(entity);
            if (status)
            {
                return DionResponse.Success(entity,"Cập nhật dữ liệu thành công!");
            }
            return DionResponse.BadRequest("Cập nhật dữ liệu thất bại");
        }
    }
}
