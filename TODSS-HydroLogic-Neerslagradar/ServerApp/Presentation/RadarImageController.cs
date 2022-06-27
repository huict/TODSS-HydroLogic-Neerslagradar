using Microsoft.AspNetCore.Mvc;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Application.RadarImage;
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
    [Route("coords")]
    public List<GridCellDTO> GetAllGridCells(InGridCellsDTO dto)
    {
        return _radarImageService.GetGridCellCoords(dto.LargeDataset, dto.CombineFields);
    }

    [HttpPost]
    [Route("intensity")]
    public List<List<GeoDataDTO>> GetWeatherData(WeatherFiltersDTO dto)
    {
        return _radarImageService.GetSpecificSlices(dto);
    }
}