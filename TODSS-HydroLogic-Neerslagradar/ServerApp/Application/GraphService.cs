using TODSS_HydroLogic_Neerslagradar.ServerApp.Application.GenerateGeoData;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Data.Reading_Data;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.TimeConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public class GraphService : IGraphService
{
    /// <summary>
    ///     Gets the average intensity for a given set of pyramided cells per timeframe of the given period
    /// </summary>
    /// <param name="dto">Contains id, pyramiding amount, start and end in seconds</param>
    public List<float> GetGraphInformation(IdBasedWeatherFilterDTO dto)
    {
        // Retrieving slices
        var (readingData, beginDepth, endDepth) = TimeConversion.GetDatasetAndDepthFromSeconds(dto.StartSeconds, dto.EndSeconds);

        // For each id adds needed slices to a list
        List<float[,,]> foundSlices = new List<float[,,]>();
        foreach (int id in dto.ids)
        {
            GridCell topLeftCell = GenerateDataDTOs.ConvertFromIdToGridCells(readingData.GetTotalWidth(), dto.CombineFields, id)[0];
            foundSlices.Add(readingData.GetSlicesWithCoordsAreaAndDepth(
                x: topLeftCell.X,
                y: topLeftCell.Y,
                z: beginDepth,
                width: dto.CombineFields,
                height: dto.CombineFields,
                dept: endDepth - beginDepth
            ));
        }

        List<float> values = new List<float>();
        for (int i = 0; i < foundSlices[0].GetLength(0); i++)
        {
            foreach (var slice in foundSlices)
            {
                List<float> intensities = new List<float>();
                for (int x = 0; x < slice.GetLength(1) - 1; x++)
                for (int y = 0; y < slice.GetLength(2) - 1; y++)
                {
                   intensities.Add(slice[i, x, y]);
                }
                values.Add(intensities.Count > 0 ? intensities.Average() : (float) 0.0);
            }
        }

        return values;
    }
}