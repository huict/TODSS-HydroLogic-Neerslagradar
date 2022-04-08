using System.Drawing;
using ASP.NETCoreWebApplication1;
using Microsoft.AspNetCore.Mvc;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation;


[Route("[controller]")]
[ApiController]
public class RadarImageController : Controller
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };
    
    
    private readonly ILogger<RadarImageController> _logger;
    private readonly IRadarImageService _radarImageService;

    public RadarImageController(RadarImageService service, ILogger<RadarImageController> logger)
    {
        _radarImageService = service;
        _logger = logger;
    }
    
    [HttpGet]
    public IEnumerable<Bitmap> Get()
    {
        var bitmaps = _radarImageService.loadData();
        return bitmaps;
    }
    
    [HttpPost]
    public IEnumerable<WeatherForecast> Post()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
    }
}