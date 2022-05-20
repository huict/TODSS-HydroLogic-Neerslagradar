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
        var coords = new []
        {
            dto.TopLeftLongitude, dto.TopLeftLatitude,  dto.TopRightLongitude ,dto.TopRightLatitude,  
            dto.BotRightLongitude, dto.BotRightLatitude,  dto.BotLeftLongitude, dto.BotLeftLatitude,
        };
        
        if (coords.Any(coord => coord == 0))
        {
            for (var i = beginZ; i < beginZ + depth; i++)
            {
                geoDataList.Add(GenerateGeoJSON.ReduceCoords(dto.CombineFields ,Pyramided.GetSlice(i)));
            }
            return geoDataList;
        }
        
        var boundsForData = GetDimensionsForSpecifiedCoords(coords);
        
        for (var i = beginZ; i < beginZ + depth; i++)
        {
            geoDataList.Add(GenerateGeoJSON.ReduceCoords(dto.CombineFields ,Pyramided.GetSlice(boundsForData.beginX, boundsForData.beginY, i, boundsForData.width, boundsForData.height)));
        }
        return geoDataList;
    }
    
    /// <summary>
    /// 
    /// </summary>
    /// <param name="coords">Coords in the projection epsg:4326</param>
    /// <returns>A tuple which specifies the values where to begin the selection of the data</returns>
    public (int beginX, int beginY, int width, int height) GetDimensionsForSpecifiedCoords(double[] coords)
    {
        var convertedCoords = CoordinateConversion.Deconversion(coords);
        int highestX = 0, highestY = 0, lowestX = 0, lowestY = 0; 
        for (int i = 0; i < convertedCoords.Length; i+=2)
        {
            if (convertedCoords[i] > highestX)
            {
                highestX = (int) Math.Ceiling(convertedCoords[i]);
            } else
            {
                lowestX = (int) Math.Floor(convertedCoords[i]);
            }

            if (convertedCoords[i + 1] > highestY)
            {
                highestY = (int) Math.Ceiling(convertedCoords[i+1]);
            } else
            {
                lowestY = (int) Math.Ceiling(convertedCoords[i+1]);
            }
        }
        return (lowestX, lowestY, highestX - lowestX, highestY - lowestY);
    }
}