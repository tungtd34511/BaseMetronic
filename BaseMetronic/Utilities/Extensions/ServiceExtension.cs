using BaseMetronic.Constants;
using BaseMetronic.Models.Entities;
using BaseMetronic.Repositories.Common;
using BaseMetronic.Repositories.Implement;
using BaseMetronic.Repositories.Interface;
using BaseMetronic.Service.Common;
using BaseMetronic.Service.Implement;
using BaseMetronic.Service.Interface;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;

namespace BaseMetronic.Utilities.Extensions
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllersWithViews()
                .AddNewtonsoftJson(o=> o.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
                ;
            services.AddHttpContextAccessor();
            services.Configure<RouteOptions>(options =>
            {
                options.LowercaseUrls = true;
                options.LowercaseQueryStrings = true;
            });
            services.AddFluentValidationAutoValidation(o => o.DisableDataAnnotationsValidation = true)
                .AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());


            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new
                        SymmetricSecurityKey
                        (Encoding.UTF8.GetBytes
                            (configuration.GetValue<string>("Jwt:Key")))
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if (!context.Request.Path.Value.Contains("api"))
                        {
                            context.Token = context.Request.Cookies[SystemConstant.Authorization.Scheme];
                        }
                        return Task.CompletedTask;
                    }
                };
            });


            services.AddAuthorization(options =>
            {
                options.DefaultPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .Build();
            });

            return services;
        }
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<CRMContext>(options => options.UseSqlServer(configuration.GetConnectionString("DBConnection"),
                builder => builder.MigrationsAssembly(typeof(CRMContext).Assembly.FullName)));

            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IAPILogRepository, APILogRepository>();
            services.AddScoped<IAPILogService, APILogService>();

            services.AddScoped<IDirectoryItemRepository, DirectoryItemRepository>();
            services.AddScoped<IDirectoryItemService, DirectoryItemService>();

            services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
            services.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));

            services.AddScoped<ITokenService, TokenService>();
            return services;

        }
    }
}
