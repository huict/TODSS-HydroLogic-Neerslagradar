using TODSS_HydroLogic_Neerslagradar.ServerApp.Application.GenerateGeoData;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Data.Reading_Data;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.TimeConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public class RadarImageService : IRadarImageService
{
    private static readonly ReadingData Pyramided = new ("neerslag_data.nc");
    // private static readonly ReadingData Original = new("neerslag.nc");

    public List<GridCellDTO> GetGridCellCoords(bool largeDataset, int combineFields)
    {
        return GenerateDataDTOs.ReduceGridcells(combineFields, Pyramided.GetTotalHeight(), Pyramided.GetTotalWidth());
    }

    /// <summary>
    /// Calculates the amount of slices from the start- and end-seconds. If a single coord is missing the method will return the whole grid in <see cref="GeoDataDTO"/>.
    /// else the selected grid is calculated and gets converted to <see cref="GeoDataDTO"/>.
    /// </summary>
    /// <param name="dto">A DTO which comes from the REST-api <see cref="WeatherFiltersDTO"/></param>
    /// <returns>Slices of the weatherdata. Depending on the begin- and endseconds the amount of slices change.</returns>
    public List<List<GeoDataDTO>> GetSpecificSlices(WeatherFiltersDTO dto)
    {
        var geoDataList = new List<List<GeoDataDTO>>();
        var (dataset, beginZ, endDepth) = TimeConversion.GetDatasetAndDepthFromSeconds(dto.StartTimestamp, dto.EndTimestamp);
        var depth = endDepth - beginZ;
        var coords = new []
        {
            dto.TopLeftLongitude, dto.TopLeftLatitude,  dto.TopRightLongitude ,dto.TopRightLatitude,  
            dto.BotRightLongitude, dto.BotRightLatitude,  dto.BotLeftLongitude, dto.BotLeftLatitude,
        };
        
        if (coords.Any(coord => coord == 0))
        {
            for (var i = beginZ; i <= beginZ + depth; i++)
            {
                geoDataList.Add(GenerateDataDTOs.ReduceGeoData(dto.CombineFields ,dataset.GetSliceWithDepth(i)));
            }
            return geoDataList;
        }
        
        var boundsForData = GetDimensionsForSpecifiedCoords(coords);
        
        for (var i = beginZ; i < beginZ + depth; i++)
        {
            geoDataList.Add(GenerateDataDTOs.ReduceGeoData(dto.CombineFields ,dataset.GetSliceWithCoordsAndArea(boundsForData.beginX, boundsForData.beginY, i, boundsForData.width, boundsForData.height), (boundsForData.beginY * dataset.GetTotalWidth() + boundsForData.beginX)- 1));
        }
        return geoDataList;
    }

    /// <summary>
    /// Calculates the BeginX, BeginY, width and height which can be used to select specific part of a slice. Of the given coords. 
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