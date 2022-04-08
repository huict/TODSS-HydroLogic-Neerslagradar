using System.Drawing;
using Microsoft.AspNetCore.Mvc;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.ColorSchemes;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.Reading_Data;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public class RadarImageService : IRadarImageService
{
    public List<Bitmap> loadData()
    {
        var ds = new ReadingData(@"C:\Users\salni\RiderProjects\TODSS-HydroLogic-Neerslagradar\TODSS-HydroLogic-Neerslagradar\sources\Knmi.Radar.Uncorrected_20210618_original.nc");
        var scheme = new TestColorScheme();
        var bitmaps = GeneratePhoto.GenerateBitmap(ds.GetSlices(0, 0, 0, 700, 765, 1), scheme);
        return bitmaps;
    }
}