namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

/// <summary>
///     The information that is needed for selecting surtain cells in a timeperiod
/// </summary>
public class IdBasedWeatherFilterDTO
{   
    public List<int>  ids { get; set; }
    public int PyramidingAmount { get; set; }
    public long StartSeconds { get; set; }
    public long EndSeconds { get; set; }
}
