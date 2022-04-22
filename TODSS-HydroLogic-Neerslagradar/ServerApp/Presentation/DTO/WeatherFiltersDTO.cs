namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

public class WeatherFiltersDTO
{
    public double Longitude { get; set; }
    public double Latitude { get; set; }
    public long StartSeconds { get; set; }
    public long EndSeconds { get; set; }
}