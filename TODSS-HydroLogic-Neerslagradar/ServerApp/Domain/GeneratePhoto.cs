using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using Rewrite_NetCdf_test.classes.colorSchemes;
using Rectangle = System.Drawing.Rectangle;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain;

public class GeneratePhoto
{
    public static List<byte[]> GenerateBitmap(float[,,] slice, IColorScheme colorScheme)
    {
        var bitmapList = new List<byte[]>();
        var width = slice.GetLength(2);
        var height = slice.GetLength(1);
        for (var depth = 0; depth < slice.GetLength(0); depth++)
        {
            var bitmap = new Bitmap(width, height);
            var imageData = bitmap.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
            var imageBytes = new byte[Math.Abs(imageData.Stride) * height];
            var scan0 = imageData.Scan0;

            Marshal.Copy(scan0, imageBytes, 0, imageBytes.Length);
            var index = 0; 
            for (var i = 0; i < imageBytes.Length; i += 4)
            {
                var color = colorScheme.GetColorValue(GetValueFromSlice(slice, index++, depth));
                //blue byte
                imageBytes[i] = color.B;
                // green byte
                imageBytes[i + 1] = color.G;
                //red byte
                imageBytes[i + 2] = color.R;
                //alpha byte
                imageBytes[i + 3] = color.Equals(Color.Black) ? (byte) 0 :  (byte) 255;
            }
            
            Marshal.Copy(imageBytes, 0, scan0, imageBytes.Length);
            bitmap.UnlockBits(imageData);
            bitmap.MakeTransparent();
            using (var stream = new MemoryStream())
            {
                bitmap.Save(stream, ImageFormat.Png);
                bitmapList.Add(stream.ToArray());
            }
        }
        
        return bitmapList;
    }

    private static float GetValueFromSlice(float[,,] slice, int index, int depth)
    {
        var col = index % slice.GetLength(2);
        var row = (index / slice.GetLength(2));
        return slice[depth, row, col];
    }
}