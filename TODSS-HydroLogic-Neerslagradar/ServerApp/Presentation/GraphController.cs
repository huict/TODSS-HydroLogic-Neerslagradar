using Microsoft.AspNetCore.Mvc;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Application;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Application.Graph;
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
    
    /// <summary>
    ///     Gets the graph data for given cells
    /// </summary>
    /// <param name="dto">DTO with the needed information</param>
    /// <returns>List of every datapoint over the timeperiod with information</returns>
    [HttpPost]
    public List<GraphDTO> GetInformationForGridCellWithId(IdBasedWeatherFilterDTO dto)
    {
        return _graphService.GetGraphInformation(dto);
    }
}