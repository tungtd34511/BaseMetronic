using BaseMetronic.Models.Entities;
using BaseMetronic.Repositories.Common;
using BaseMetronic.Repositories.Interface;
using BaseMetronic.Service.Common;
using BaseMetronic.Service.Interface;
using BaseMetronic.Utilities;
using BaseMetronic.ViewModels.APILogs;

namespace BaseMetronic.Service.Implement
{
    public class APILogService : BaseService<APILog>, IAPILogService
    {
        private readonly ILogger _logger;
        private readonly IAPILogRepository _APILogRepository;
        public APILogService(IBaseRepository<APILog> repository, ILoggerFactory loggerFactory, IAPILogRepository aPILogRepository) : base(repository)
        {
            _logger = loggerFactory.CreateLogger<APILogService>();
            _APILogRepository = aPILogRepository;
        }

        /// <summary>
        /// Author: TUNGTD
        /// Created: 28/09/2024
        /// Description: Add
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<DionResponse> AddAsync(AddAPILogDTO model)
        {
            var obj = new APILog()
            {
                StatusCode = model.StatusCode,
                AccountId = model.AccountId,
                Active = true,
                CreatedTime = DateTime.Now,
                Path = model.Path,
                Type = model.Type,
                Title = model.Title
            };
            await _APILogRepository.AddAsync(obj);
            return DionResponse.Created(obj);
        }
    }
}
