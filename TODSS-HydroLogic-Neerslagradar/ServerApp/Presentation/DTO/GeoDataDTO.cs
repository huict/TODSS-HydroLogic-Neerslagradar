using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

public struct GeoDataDTO
{
    public List<List<List<double>>> coords { get; set; }
    public float intensity { get; set; }
}