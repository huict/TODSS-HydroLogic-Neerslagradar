using GeoJSON.Net.Geometry;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

public class GridCell
{   
    public double[] Coordinates;
    public int X;
    public int Y;
    public List<List<List<double>>> coordsForGeoJson;
    
    public GridCell(double[] coordinates, int x, int y)
    {
        Coordinates = coordinates;
        X = x;
        Y = y;
        coordsForGeoJson = GenerateCoordsGeoJson(coordinates);
    }

    public static List<List<List<double>>> GenerateCoordsGeoJson(IReadOnlyList<double> coordinates)
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
        // list2.Add(list2[0]);
        return new List<List<List<double>>>{list2};
        
    }
}