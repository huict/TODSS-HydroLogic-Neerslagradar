using System.Drawing;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.ColorSchemes;

public interface IColorScheme
{ 
    Color GetColorValue(float number);
}