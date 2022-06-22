using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public interface ICellInformationService
{
    
    // TODO: Figure out return type
    void GetCellInformation(InformationNeededForCellInformationDTO dto);
}