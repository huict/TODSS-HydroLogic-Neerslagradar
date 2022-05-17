using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public interface IRadarImageService
{
    IEnumerable<byte[]> LoadData();
    List<List<GeoDataDTO>> GetSpecificSlices(WeatherFiltersDTO dto);

}