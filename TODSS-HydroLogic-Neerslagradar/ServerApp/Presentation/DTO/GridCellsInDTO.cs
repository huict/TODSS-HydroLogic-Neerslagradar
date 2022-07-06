namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

/// <summary>
///     The information need for returning a grid for a map
/// </summary>
public class InGridCellsDTO
{
    /// <summary>
    ///     The amount the data will be pyramided
    /// </summary>
    public int PyramidingAmount { get; set; }
    
    /// <summary>
    ///     Represents if it needs to use the original or pyramided dataset.
    ///     ( Original is only available for a single day )
    /// </summary>
    public bool LargeDataset { get; set; }
}