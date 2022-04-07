namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.Reading_Data;

public interface IReadingData
{
    float[,,] GetSlice(int x, int y, int z, int width, int height);

    float[,,] GetSlices(int x, int y, int z, int width, int height, int dept);
}