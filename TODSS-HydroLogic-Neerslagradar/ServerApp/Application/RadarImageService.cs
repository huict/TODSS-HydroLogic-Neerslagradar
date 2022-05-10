using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.ColorSchemes;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.GenerateGeoJSON;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.Reading_Data;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.TimeConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public class RadarImageService : IRadarImageService
{
    private static readonly ReadingData Pyramided = new ("neerslag_data.nc");
    // private static readonly ReadingData Original = new("neerslag.nc");
    
    public IEnumerable<byte[]> loadData()
    {
        var ds = new ReadingData(@"C:\Users\salni\RiderProjects\TODSS-HydroLogic-Neerslagradar\TODSS-HydroLogic-Neerslagradar\sources\Knmi.Radar.Uncorrected_20210618_original.nc");
        var scheme = new PreciezeColor();
        var bitmaps = GeneratePhoto.GenerateBitmap(ds.GetSlices(0, 0, 0, 700, 765, 36), scheme);
        return bitmaps;
    }

    public IEnumerable<IEnumerable<GeoDataDTO>> GetSpecificSlices(WeatherFiltersDTO dto)
    {
        var beginZ = TimeConversion.GetDepthFromSeconds(dto.StartSeconds);
        var depth = TimeConversion.GetDepthFromSeconds(dto.EndSeconds) - beginZ;
        //TODO Conversion from coordinates to x, y and height, width in dataset
        for (var i = beginZ; i < beginZ + depth; i++)
        {
            yield return GenerateGeoJSON.GenerateGeo(Pyramided.GetSlices(0, 0, beginZ, 175, 192, depth));
        }
    }
    
}