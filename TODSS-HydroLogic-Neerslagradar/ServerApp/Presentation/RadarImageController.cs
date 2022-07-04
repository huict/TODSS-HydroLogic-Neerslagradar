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

    /// <summary>
    ///     Gives back all the cells in the grid for a given pyramiding amount
    /// </summary>
    /// <param name="dto"> DTO with the information that is needed</param>
    /// <returns></returns>
    [HttpPost]
    [Route("coords")]
    public List<GridCellDTO> GetAllGridCells(InGridCellsDTO dto)
    {
        return _radarImageService.GetGridCellCoords(dto.LargeDataset, dto.PyramidingAmount);
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
        return _radarImageService.GetSpecificSlices(dto);
    }
}