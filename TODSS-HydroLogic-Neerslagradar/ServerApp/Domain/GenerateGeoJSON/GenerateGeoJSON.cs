using GeoJSON.Net.Feature;
using GeoJSON.Net.Geometry;
using Newtonsoft.Json;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.GenerateGeoJSON;

public class GenerateGeoJSON
{
    private static readonly GridSingelton Grid = GridSingelton.Grid;
    
    public static string GenerateGeo()
    {
        var featureCollection = new FeatureCollection();
        for (int i = 0; i < 1; i++)
        {
            for (int j = 0; j < 765; j++)
            {
                var polygon = Grid.FindByGridCoordinates(i,j ).Polygon;

                var feature = new Feature(polygon);
                feature.Properties.Add("stroke"," #000000");
                feature.Properties.Add("stroke-opacity", 1);
                feature.Properties.Add("fill"," #ff0000");
                feature.Properties.Add("fill-opacity", 0.5);
                feature.Properties.Add("stroke-width", 2);
                featureCollection.Features.Add(feature);
            }
            
        }

        return JsonConvert.SerializeObject(featureCollection);
    }
}