using System.Drawing;
using System.Drawing.Imaging;
using Microsoft.AspNetCore.Mvc;
using Rewrite_NetCdf_test.classes.colorSchemes;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.ColorSchemes;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.Reading_Data;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public class RadarImageService : IRadarImageService
{
    public List<byte[]> loadData()
    {
        var ds = new ReadingData(@"C:\Users\salni\RiderProjects\TODSS-HydroLogic-Neerslagradar\TODSS-HydroLogic-Neerslagradar\sources\Knmi.Radar.Uncorrected_20210618_original.nc");
        var scheme = new PreciezeColor();
        var bitmaps = GeneratePhoto.GenerateBitmap(ds.GetSlices(0, 0, 1, 700, 765, 36), scheme);
        iets(bitmaps[0]);
        return bitmaps;
    }

    private void iets(byte[] array)
    {
        Bitmap bmp;
        using (var ms = new MemoryStream(array))
        {
            bmp = new Bitmap(ms);
            bmp.Save(@"C:\Users\salni\RiderProjects\iets.png", ImageFormat.Png);
        }
    }
}