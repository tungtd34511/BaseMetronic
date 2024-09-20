using BaseMetronic.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BaseMetronic.Utilities.Extensions
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllersWithViews().AddRazorRuntimeCompilation();
            services.Configure<RouteOptions>(options =>
            {
                options.LowercaseUrls = true;
                options.LowercaseQueryStrings = true;
            });
            return services;
        }
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<CRMContext>(options => options.UseSqlServer(configuration.GetConnectionString("DBConnection"),
                builder => builder.MigrationsAssembly(typeof(CRMContext).Assembly.FullName)));
            return services;

        }
    }
}
