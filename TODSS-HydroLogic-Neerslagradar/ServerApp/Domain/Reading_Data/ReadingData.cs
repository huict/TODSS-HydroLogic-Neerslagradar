using Microsoft.Research.Science.Data;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.Reading_Data;

public class ReadingData : IReadingData
{
    private DataSet Ds { get; }
    private Variable _p;
    public int Y, X, Time;

    public ReadingData(string filePath)
    {
        Ds = DataSet.Open(filePath, ResourceOpenMode.ReadOnly);
        foreach (var variable in Ds.Variables)
        {
            if (variable.Name != "P") continue;
            _p = variable;
            foreach (var dimension in variable.Dimensions)
            {
                switch (dimension.Name)
                {
                    case "time" : 
                        Time = dimension.Length;
                        break;
                    case "x":
                        X = dimension.Length;
                        break;
                    case "y" :
                        Y = dimension.Length;
                        break;
                }
            }
            break;
        }
    }

    public float[,,] GetSlice(int z)
    {
        return GetSlices(0, 0, z, X, Y, 1);
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
