using BaseMetronic.Models.Entities;
using BaseMetronic.Service.Common;
using BaseMetronic.Utilities;
using BaseMetronic.ViewModels.APILogs;

namespace BaseMetronic.Service.Interface
{
    public interface IAPILogService : IBaseService<APILog>
    {
        Task<DionResponse> AddAsync(AddAPILogDTO model);
    }
}
