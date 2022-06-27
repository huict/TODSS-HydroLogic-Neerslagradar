using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application.Graph;

public interface IGraphService
{
    List<GraphDTO> GetGraphInformation(IdBasedWeatherFilterDTO dto);
}