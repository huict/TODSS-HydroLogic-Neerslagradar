using System.Drawing;

namespace Rewrite_NetCdf_test.classes.colorSchemes;

public interface IColorScheme
{ 
    Color GetColorValue(float number);
}