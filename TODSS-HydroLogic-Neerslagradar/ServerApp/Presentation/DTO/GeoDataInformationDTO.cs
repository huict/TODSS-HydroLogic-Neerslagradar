namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

public class GeoDataInformationDTO
{
    public long  id { get; set; }
    
    //Isnt this already in GeoDataDTO
    public long averageIntesity { get; set; }
    
    // Is cumulative actually nescescary
    public long  cumulative { get; set; }
}