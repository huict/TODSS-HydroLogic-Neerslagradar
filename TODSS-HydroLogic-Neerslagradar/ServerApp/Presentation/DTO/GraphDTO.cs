namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

/// <summary>
///     Represents a single datapoint in a timeperiod
/// </summary>
public class GraphDTO
{
    public float Cumulative { get; set; }
    public float Average { get; set; }
}