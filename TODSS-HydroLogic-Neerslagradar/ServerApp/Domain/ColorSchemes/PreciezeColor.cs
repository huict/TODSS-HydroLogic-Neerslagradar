using System.Drawing;
using Rewrite_NetCdf_test.classes.colorSchemes;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.ColorSchemes;

public class PreciezeColor : IColorScheme
{
    public Color GetColorValue(float number)
    {
        if (number <= 0.0050354004)
        {
            return Color.Black;
        }
        if (number <= 0.014819145)
        {
            return Color.FromArgb(11, 161, 168);
        }
        if (number <= 0.026351929)
        {
            return Color.FromArgb(66, 139, 193);
        }
        if (number <= 0.050359726)
        {
            return Color.FromArgb(50, 70, 240);
        }
        if (number <= 0.111125946)
        {
            return Color.FromArgb(120,50,120);
        }
        if (number <= 0.32701874)
        {
            return Color.FromArgb(160, 48, 180);
        }
        return number <=  0.54115295 ? Color.FromArgb(160, 15, 90) : Color.FromArgb(218, 15, 15);
    }
}