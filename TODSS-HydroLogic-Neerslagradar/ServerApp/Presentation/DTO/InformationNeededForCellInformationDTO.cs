namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

public class InformationNeededForCellInformationDTO
{   
    public int CellId { get; set; }
    public int CombineFields { get; set; }
    public long StartSeconds { get; set; }
    public long EndSeconds { get; set; }
}
