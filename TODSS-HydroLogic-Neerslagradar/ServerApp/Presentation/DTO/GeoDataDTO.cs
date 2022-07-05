using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

/// <summary>
///     Represents the data going out of a cell based on id and the intensity of that cell
/// </summary>
public struct GeoDataDTO
{
    public long  Id { get; set; }
    public float Intensity { get; set; }
}