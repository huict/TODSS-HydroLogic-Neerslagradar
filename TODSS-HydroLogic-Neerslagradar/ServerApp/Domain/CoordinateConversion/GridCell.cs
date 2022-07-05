using GeoJSON.Net.Geometry;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

/// <summary>
/// Connects the calculated coordinates to the corresponding X and Y of a cell in the data
/// </summary>
public struct GridCell
{
    public readonly double[] Coordinates;
    public readonly int X;
    public readonly int Y;

    public GridCell(double[] coordinates, int x, int y)
    {
        Coordinates = coordinates;
        X = x;
        Y = y;
    }
}