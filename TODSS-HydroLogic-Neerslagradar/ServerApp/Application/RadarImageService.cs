using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.ColorSchemes;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.GenerateGeoJSON;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.Reading_Data;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.TimeConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public class RadarImageService : IRadarImageService
{
    private static readonly ReadingData Pyramided = new ("neerslag_data.nc");
    // private static readonly ReadingData Original = new("neerslag.nc");

    public List<List<GeoDataDTO>> GetSpecificSlices(WeatherFiltersDTO dto)
    {
        var geoDataList = new List<List<GeoDataDTO>>();
        var beginZ = TimeConversion.GetDepthFromSeconds(dto.StartSeconds);
        var depth = TimeConversion.GetDepthFromSeconds(dto.EndSeconds) - beginZ;
        //TODO Conversion from coordinates to x, y and height, width in dataset
        var coords = new []
        {
            dto.TopRightLongitude ,dto.TopRightLatitude,  dto.TopLeftLongitude, dto.TopLeftLatitude, 
            dto.BotRightLongitude, dto.BotRightLatitude,  dto.BotLeftLongitude, dto.BotLeftLatitude,
        };
        CoordinateConversion.Deconversion(coords);
        for (var i = beginZ; i < beginZ + depth; i++)
        {
            geoDataList.Add(GenerateGeoJSON.ReduceCoords(dto.CombineFields ,Pyramided.GetSlice(0, 0, i, 175, 192)));
        }
        return geoDataList;
    }


    public (int beginX, int beginY, int width, int height) GetDimensionsForSpecifiedCoords(double[] coords)
    {
        return (0, 0, 0, 0);
    }

}