using System.Drawing;
using ASP.NETCoreWebApplication1;
using Microsoft.AspNetCore.Mvc;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    private readonly IRadarImageService _radarImageService;

    public WeatherForecastController(ILogger<WeatherForecastController> logger, IRadarImageService radarImageService)
    {
        _logger = logger;
        _radarImageService = radarImageService;
    }

    [HttpGet]
    public IEnumerable<byte[]> Get()
    {
        // return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //     {
        //         Date = DateTime.Now.AddDays(index),
        //         TemperatureC = Random.Shared.Next(-20, 55),
        //         Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        //     })
        //     .ToArray();

        return _radarImageService.loadData();
    }
}