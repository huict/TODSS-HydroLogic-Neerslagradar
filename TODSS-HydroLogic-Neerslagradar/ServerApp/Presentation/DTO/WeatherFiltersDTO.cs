namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

/// <summary>
///     The information that is needed for selecting all cells in a timeperiod
/// </summary>
public class WeatherFiltersDTO
{
    public int PyramidingAmount { get; set; }
    public long StartTimestamp { get; set; }
    public long EndTimestamp { get; set; }
}