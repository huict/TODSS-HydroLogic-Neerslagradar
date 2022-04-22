using TODSS_HydroLogic_Neerslagradar.ServerApp.Application;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

const bool startWebsite = true;

var coordinateConversion = new CoordinateConversion();
coordinateConversion.ProvideGridCellCoordinates();

if (startWebsite)
{
    var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

    builder.Services.AddControllersWithViews();

    builder.Services.AddScoped<IRadarImageService, RadarImageService>();

    var app = builder.Build();
    builder.Services.AddControllers();

// Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseRouting();


    app.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");

    app.MapFallbackToFile("index.html");

    app.Run();
}
