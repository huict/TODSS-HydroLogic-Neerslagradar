using TODSS_HydroLogic_Neerslagradar.ServerApp.Data.Reading_Data;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.TimeConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public class CellInformationService
{
    // Id RadarImageService regel 49
    //(boundsForData.beginY * dataset.GetTotalWidth() + boundsForData.beginX)- 1)



   
    // pyramiding uitvogelen
    // stats uitrekenen voor die bepaalde cell

    public void GetInformationForCell(InformationNeededForCellInformationDTO informationNeededForCellInformation)
    {
        // Retrieving slices
        var dataset = TimeConversion.GetDatasetAndDepthFromSeconds(informationNeededForCellInformation.StartSeconds, informationNeededForCellInformation.EndSeconds);
        IReadingData readingData = dataset.dataSet;
        int depth = dataset.endDepth - dataset.beginDepth;
        
        // result:
        var slices = readingData.GetSliceWithDepth(dataset.beginDepth, depth);

        // Calculating pyramided dataset
        int datasetWidth = readingData.GetTotalWidth();
        int datasetHeight = readingData.GetTotalHeight();
        int combineFields = informationNeededForCellInformation.CombineFields;
        int widthToWide = datasetWidth % combineFields;
        int heightToHigh = datasetHeight % combineFields;

        // result:
        int pyramidedWidth = (datasetWidth - widthToWide) / combineFields;
        int pyramidedHeight = (datasetHeight - heightToHigh) / combineFields;

    }
}