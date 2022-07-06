using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application.RadarData;

public interface IRadarDataService
{
    List<List<GeoDataDTO>> GetSpecificSlices(WeatherFiltersDTO dto);
    List<GridCellDTO> GetGridCellCoords(bool largeDataset, int combineFields);
}