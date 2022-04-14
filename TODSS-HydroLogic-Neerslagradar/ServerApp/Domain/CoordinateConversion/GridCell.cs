using GeoJSON.Net.Geometry;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

public class GridCell
{   
    public double[] Coordinates;
    public int X;
    public int Y;
    public Polygon Polygon;
    
    public GridCell(double[] coordinates, int x, int y)
    {
        Coordinates = coordinates;
        this.X = x;
        this.Y = y;
        Polygon = GeneratePolygon(coordinates);
    }

    private Polygon GeneratePolygon(IReadOnlyList<double> coordinates)
    {
        var list2 = new List<List<double>>();
        for (var k = 0; k < coordinates.Count; k+=2)
        {
            var list = new List<double>()
            {
                coordinates[k], coordinates[k+1]
            };
            list2.Add(list);
        }
        list2.Add(list2[0]);
        return new Polygon(new List<List<List<double>>>{list2});
        
    }
}