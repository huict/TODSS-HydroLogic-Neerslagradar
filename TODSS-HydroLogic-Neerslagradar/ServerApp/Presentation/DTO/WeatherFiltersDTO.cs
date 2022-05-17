namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

public class WeatherFiltersDTO
{
    public double TopRightLongitude { get; set; }
    public double TopRightLatitude { get; set; }
    
    public double TopLeftLongitude { get; set; }
    public double TopLeftLatitude { get; set; }
    
    public double BotRightLongitude { get; set; }
    public double BotRightLatitude { get; set; }
    
    public double BotLeftLongitude { get; set; }
    public double BotLeftLatitude { get; set; }

    public bool LargeDataset { get; set; }
    
    public int CombineFields { get; set; }
    public long StartSeconds { get; set; }
    public long EndSeconds { get; set; }
}