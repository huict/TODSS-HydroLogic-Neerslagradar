using Microsoft.Research.Science.Data;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.Reading_Data;

public class Reading_Data : IReadingData
{
    private DataSet Ds { get; }
    private Variable _p;

    public Reading_Data(string filePath)
    {
        Ds = DataSet.Open(filePath, ResourceOpenMode.ReadOnly);
        foreach (var variable in Ds.Variables)
        {
            if (variable.Name != "P") continue;
            _p = variable;
            break;
        }
    }
    
    public float[,,] GetSlice(int x, int y, int z, int width, int height)
    {
        return GetSlices(x, y, z, width, height, 1);
    }

    public float[,,] GetSlices(int x, int y, int z, int width, int height, int depth)
    {
        return (float[,,])_p.GetData(new []{z, y, x},null , new []{depth, height, width});
    }
}
