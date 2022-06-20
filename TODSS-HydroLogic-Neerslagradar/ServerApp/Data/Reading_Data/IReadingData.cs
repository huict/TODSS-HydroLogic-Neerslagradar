namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Data.Reading_Data;

public interface IReadingData
{
    int GetTotalWidth();
    int GetTotalHeight();
    int GetMaxDepth();
    float[,,] GetSliceWithDepth(int z);
    float[,,] GetSliceWithCoordsAndArea(int x, int y, int z, int width, int height);

    float[,,] GetSlicesWithCoordsAreaAndDepth(int x, int y, int z, int width, int height, int dept);
}