using Microsoft.AspNetCore.Mvc;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Application;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation;

[ApiController]
[Route("[controller]")]
public class GraphController : ControllerBase
{
    private IGraphService _graphService;

    public GraphController(IGraphService graphService)
    {
        _graphService = graphService;
    }
    
    [HttpPost]
    public List<GraphDTO> GetInformationForGridCellWithId(IdBasedWeatherFilterDTO dto)
    {
        return _graphService.GetGraphInformation(dto);
    }
}