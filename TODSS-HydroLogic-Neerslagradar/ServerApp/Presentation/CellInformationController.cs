using Microsoft.AspNetCore.Mvc;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Application;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation;

[ApiController]
[Route("[controller]")]
public class CellInformationController : ControllerBase
{
    private ICellInformationService _cellInformationService;

    public CellInformationController(ICellInformationService cellInformationService)
    {
        _cellInformationService = cellInformationService;
    }
    
    // TODO: figure out return type in CellInformationService
    public void GetInformationForGridCellWithId(InformationNeededForCellInformationDTO dto)
    {
        _cellInformationService.GetCellInformation(dto);
    }
}