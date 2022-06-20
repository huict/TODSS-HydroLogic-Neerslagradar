using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public interface IRadarImageService
{
    List<List<GeoDataDTO>> GetSpecificSlices(WeatherFiltersDTO dto);
    List<GridCellDTO> GetGridCellCoords(bool largeDataset, int combineFields);

    (int beginX, int beginY, int width, int height) GetDimensionsForSpecifiedCoords(double[] coords);
}