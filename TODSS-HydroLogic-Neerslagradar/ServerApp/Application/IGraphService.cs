using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public interface IGraphService
{
    List<float> GetGraphInformation(IdBasedWeatherFilterDTO dto);
}