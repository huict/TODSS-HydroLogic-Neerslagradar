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

    /// <summary>
    ///     Gives back all the cells in the grid for a given pyramiding amount
    /// </summary>
    /// <param name="dto"> DTO with the information that is needed</param>
    /// <returns></returns>
    [HttpPost]
    [Route("coords")]
    public List<GridCellDTO> GetAllGridCells(InGridCellsDTO dto)
    {
        return _radarDataService.GetGridCellCoords(dto.LargeDataset, dto.CombineFields);
    }
    
    /// <summary>
    ///     Gives back all the intensities that are not zero for a given timeperiod
    /// </summary>
    /// <param name="dto">Dto with the infromation that is needed</param>
    /// <returns></returns>
    [HttpPost]
    [Route("intensity")]
    public List<List<GeoDataDTO>> GetWeatherData(WeatherFiltersDTO dto)
    {
        return _radarDataService.GetSpecificSlices(dto);
    }
}