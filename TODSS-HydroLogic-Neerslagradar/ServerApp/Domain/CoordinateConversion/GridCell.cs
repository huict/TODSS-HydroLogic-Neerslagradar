namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

public class GridCell
{   
    public double[] Coordinates;
    public int X;
    public int Y;

    public GridCell(double[] coordinates, int x, int y)
    {
        Coordinates = coordinates;
        this.X = x;
        this.Y = y;
    }
}