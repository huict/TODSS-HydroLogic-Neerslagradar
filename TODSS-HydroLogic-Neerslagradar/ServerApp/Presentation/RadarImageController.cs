using Microsoft.AspNetCore.Mvc;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Application.RadarData;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation;

[ApiController]
[Route("[controller]")]
public class RadarImageController :  ControllerBase
{
    
    private readonly IRadarDataService _radarDataService;

    public RadarImageController(IRadarDataService radarDataService)
    {
        _radarDataService = radarDataService;
    }

    [HttpPost]
    [Route("coords")]
    public List<GridCellDTO> GetAllGridCells(InGridCellsDTO dto)
    {
        return _radarDataService.GetGridCellCoords(dto.LargeDataset, dto.CombineFields);
    }

    [HttpPost]
    [Route("intensity")]
    public List<List<GeoDataDTO>> GetWeatherData(WeatherFiltersDTO dto)
    {
        return _radarDataService.GetSpecificSlices(dto);
    }
}