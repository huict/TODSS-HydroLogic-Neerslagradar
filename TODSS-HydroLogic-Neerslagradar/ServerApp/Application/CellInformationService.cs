using TODSS_HydroLogic_Neerslagradar.ServerApp.Application.GenerateGeoData;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Data.Reading_Data;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.TimeConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public class CellInformationService : ICellInformationService
{
    /// <summary>
    ///     Gets calculated information for a single pyramided cell
    /// </summary>
    /// <param name="dto">Contains id, pyramiding amount, start and end in seconds</param>
    public void GetCellInformation(InformationNeededForCellInformationDTO dto)
    {
        // Retrieving slices
        var dataset = TimeConversion.GetDatasetAndDepthFromSeconds(dto.StartSeconds, dto.EndSeconds);
        IReadingData readingData = dataset.dataSet;
        List<GridCell> cellsInPyramidedCell = GenerateDataDTOs.ConvertFromIdToGridCells(readingData.GetTotalHeight(), dto.CombineFields, dto.CellId);

        var slices = readingData.GetSlicesWithCoordsAreaAndDepth(
            x: cellsInPyramidedCell[0].X,
            y: cellsInPyramidedCell[0].Y,
            z: dataset.beginDepth,
            width: dto.CombineFields,
            height: dto.CombineFields,
            dept: dataset.endDepth - dataset.beginDepth
            );
        
        // TODO: Figure out return type
        // Defenitly a List<List<DTO>>
        // GeoDataDTO or a different DTO
    }
}