using TODSS_HydroLogic_Neerslagradar.ServerApp.Application.GenerateGeoData;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.TimeConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application.RadarData;

public class RadarDataService : IRadarDataService
{
    public List<GridCellDTO> GetGridCellCoords(bool largeDataset, int combineFields)
    {
        return GenerateDataDTOs.ReduceGridcells(combineFields);
    }

    /// <summary>
    /// Calculates the amount of slices from the start- and end-seconds. The method will return the whole grid in <see cref="GeoDataDTO"/>.
    /// else the selected grid is calculated and gets converted to <see cref="GeoDataDTO"/>.
    /// </summary>
    /// <param name="dto">A DTO which comes from the REST-api <see cref="WeatherFiltersDTO"/></param>
    /// <returns>Slices of the weatherdata. Depending on the begin- and endseconds the amount of slices change.</returns>
    public List<List<GeoDataDTO>> GetSpecificSlices(WeatherFiltersDTO dto)
    {
        var geoDataList = new List<List<GeoDataDTO>>();
        var (dataset, beginZ, endDepth) = TimeConversion.GetDatasetAndDepthFromSeconds(dto.StartTimestamp, dto.EndTimestamp);
        var depth = endDepth - beginZ;
        
        for (var i = beginZ; i <= beginZ + depth; i++)
        {
            geoDataList.Add(GenerateDataDTOs.ReduceGeoData(dto.PyramidingAmount ,dataset.GetSliceWithDepth(i)));
        }
        return geoDataList;
    }
}
