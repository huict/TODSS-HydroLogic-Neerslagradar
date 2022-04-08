using System.Drawing;
using ASP.NETCoreWebApplication1;
using Microsoft.AspNetCore.Mvc;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation;


[ApiController]
[Route("[controller]")]
public class RadarImageController :  ControllerBase
{
   
    private readonly ILogger<RadarImageController> _logger;
    private readonly IRadarImageService _radarImageService;

    public RadarImageController(IRadarImageService service, ILogger<RadarImageController> logger)
    {
        _radarImageService = service;
        _logger = logger;
    }
    
    // [HttpGet]
    // public IEnumerable<Bitmap> Get()
    // {
    //     var bitmaps = _radarImageService.loadData();
    //     return bitmaps;
    // }
    

}