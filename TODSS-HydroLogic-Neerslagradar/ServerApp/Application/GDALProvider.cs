using MaxRev.Gdal.Core;
using OSGeo.GDAL;
using OSGeo.OGR;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public class GDALProvider
{
    private static string root_path =
        "C:\\Users\\arvid\\RiderProjects\\TODSS-HydroLogic-Neerslagradar\\TODSS-HydroLogic-Neerslagradar\\sources\\";
    private static string source_file_path = root_path + "Knmi.Radar.Uncorrected_20210618_pyramided.nc";
    private static string output_file_path = root_path + "img.png";

    private string[] code_input = new[] {source_file_path, output_file_path};
    
    public void loadData()
    {
        var gdalRead = new TempGDALReadExample();

        gdalRead.read(code_input);
    }
}