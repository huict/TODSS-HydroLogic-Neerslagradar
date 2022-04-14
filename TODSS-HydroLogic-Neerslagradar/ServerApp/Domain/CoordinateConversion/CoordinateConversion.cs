using DotSpatial.Projections;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

public class CoordinateConversion
{
    private static string _sourceProj4Params = "+proj=stere +lat_0=90 +lat_ts=60 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378.14 +b=6356.75";
    private static string _targetProj4Params = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    
    public static ProjectionInfo SourceCRF = ProjectionInfo.FromProj4String(_sourceProj4Params);
    public static ProjectionInfo TargetCRF = ProjectionInfo.FromProj4String(_targetProj4Params);

    private const double XLowerLeft = 0;
    private const double YLowerLeft = -4415.002329;
    private const int Columns = 700;
    private const int Rows = 765;
    private const double CellWidth = 1.0000013;
    private const double CellHeight = 1.0000052;

    private static GridSingelton _grid = GridSingelton.Grid;


    public void ProvideGridCellCoordinates()
    {
        List<GridCell> gridCellList = new List<GridCell>();
        for (int y = 0; y < Rows; y++)
        {
            for (int x = 0; x < Columns; x++)
            {
                gridCellList.Add(new GridCell(Conversion(GenerateCoordinatesForCell(x, y)), x, y));
            }
        }
        
        GridSingelton.AddGridCellList(gridCellList);
    }
    
    //TODO coordinates that should be on the same line aren't cause the conversion happens twice. This should be optimized
    public double[] Conversion(double[] coordinates)
    {
        double[] numberOfCoordinates = new double[coordinates.Length / 2];
        Reproject.ReprojectPoints(coordinates, numberOfCoordinates, SourceCRF, TargetCRF, 0, numberOfCoordinates.Length);
        return coordinates;
    }

    private double[] GenerateCoordinatesForCell(int x, int y)
    {
        double[] coordinates = new double[8];
        
        // Lower left corner of cell
        coordinates[0] = XLowerLeft + x * CellWidth;
        coordinates[1] = YLowerLeft + y * CellHeight;
        // Lower right corner of cell
        coordinates[2] = XLowerLeft + (x + 1) * CellWidth;
        coordinates[3] = YLowerLeft + y * CellHeight;
        // top right corner of cell
        coordinates[4] = XLowerLeft + (x + 1) * CellWidth;
        coordinates[5] = YLowerLeft + (y + 1) * CellHeight;
        // top left corner of cell
        coordinates[6] = XLowerLeft + x * CellWidth;
        coordinates[7] = YLowerLeft + (y + 1) * CellHeight;

        return coordinates;
    }
}