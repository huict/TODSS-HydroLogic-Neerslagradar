namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

public class IdBasedGeoDataDTO
{
    public List<int>  ids { get; set; }
    
    public long Intensity { get; set; }
    
    public long  cumulative { get; set; }
}