using Microsoft.AspNetCore.Mvc;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Application;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation;

[ApiController]
[Route("[controller]")]
public class RadarImageController :  ControllerBase
{
    
    private readonly IRadarImageService _radarImageService;

    public RadarImageController(IRadarImageService radarImageService)
    {
        _radarImageService = radarImageService;
    }
    

    [HttpPost]
    public List<List<GeoDataDTO>> test(WeatherFiltersDTO dto)
    {
        return _radarImageService.GetSpecificSlices(dto);
    }
}