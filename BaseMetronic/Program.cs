using BaseMetronic.Constants;
using BaseMetronic.Utilities.Extensions;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
Log.Logger = new LoggerConfiguration()
               .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Information)
               .Enrich.FromLogContext()
               .WriteTo.File("Logs/log.txt", rollingInterval: RollingInterval.Day)
               .WriteTo.Console()
               .CreateLogger();

builder.Host.UseSerilog();
var mvcBuilder = builder.Services.AddControllersWithViews();

if (builder.Environment.IsDevelopment())
{
    mvcBuilder.AddRazorRuntimeCompilation();
}
builder.Services.AddInfrastructure(builder.Configuration)
    .AddInfrastructureServices(builder.Configuration);



var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.Use(async (ctx, next) =>
{
    await next();
    var extension = Path.GetExtension(ctx.Request.Path.Value);
    if (string.IsNullOrEmpty(extension))
    {

    }
    if (!ctx.Request.Path.Value.Contains("api") && ctx.Request.Path.Value.Contains("admin") && !ctx.Response.HasStarted)
    {
        if (ctx.Response.StatusCode == 401) //UnAuthorization
        {
            var redirecURL = ctx.Request.Path.ToUriComponent();
            ctx.Response.Cookies.Delete(SystemConstant.Authorization.Scheme);
        ctx.Response.Redirect($"/admin/sign-in?returnurl={redirecURL}");
        }
        else if (ctx.Response.StatusCode == 500 || ctx.Response.StatusCode == 400)//error
        {
            ctx.Response.Redirect("/admin/error-500");
        }
        else if (ctx.Response.StatusCode == 404)//Not found
        {
            ctx.Response.Redirect("/admin/error-404");
        }
    }
});

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Admin}/{action=Index}/{id?}");

app.Run();
