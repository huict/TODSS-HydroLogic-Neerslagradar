using System.Drawing;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.ColorSchemes;

public class TestColorScheme : IColorScheme
{
    public Color GetColorValue(float number)
    {
        if (number <= 0.00074414062)
        {
            return Color.FromArgb(0, 0, 0);
        }
        if (number <= 0.0015907288)
        {
            return Color.FromArgb(0, 0, 0);
            // return Color.FromArgb(11, 161, 168);
            
        } if (number <= 0.006713867)
        {
            return Color.FromArgb(66, 139, 193);
        }

        if (number <= 0.017112732)
        {
            return Color.FromArgb(50, 70, 210);
        }

        if (number <= 0.050361633)
        {
            return Color.FromArgb(120,50,120);
        }
        
        if (number <= 0.35141754 )
        {
            return Color.FromArgb(160, 48, 180);
        } return number <= 3.1245151 ? Color.FromArgb(140, 15, 90) : Color.FromArgb(255, 15, 15);
    }
}