namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

/// <summary>
///     Information you get back after requesting the whole grid
/// </summary>
public class GridCellDTO
{
    public List<List<List<double>>> coords { get; set; }
    public long id { get; set; }
}