using TODSS_HydroLogic_Neerslagradar.ServerApp.Application;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

const bool startWebsite = true;
const string _myAllowSpecificOrigins = "_myAllowSpecificOrigins";

var coordinateConversion = new CoordinateConversion();
coordinateConversion.GenerateCellGrids();

if (startWebsite)
{
    var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: _myAllowSpecificOrigins,
            policy =>
            {
                policy.AllowAnyOrigin();
                policy.AllowAnyMethod();
                policy.AllowAnyHeader();
            });
    });

    builder.Services.AddControllersWithViews();

    builder.Services.AddScoped<IRadarImageService, RadarImageService>();
    builder.Services.AddScoped<IGraphService, GraphService>();

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
    app.UseCors(_myAllowSpecificOrigins);


    app.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");

    app.MapFallbackToFile("index.html");

    app.Run();
}