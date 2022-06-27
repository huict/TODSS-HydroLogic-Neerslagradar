namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

public class WeatherFiltersDTO
{
    public bool LargeDataset { get; set; }
    public int CombineFields { get; set; }
    public long StartTimestamp { get; set; }
    public long EndTimestamp { get; set; }
}