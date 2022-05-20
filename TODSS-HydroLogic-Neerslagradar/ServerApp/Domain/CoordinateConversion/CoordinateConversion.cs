using DotSpatial.Projections;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

public class CoordinateConversion
{
    private static string _sourceProj4Params = "+proj=stere +lat_0=90 +lat_ts=60 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378.14 +b=6356.75";
    private static string _targetProj4Params = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

    public static ProjectionInfo SourceCRF = ProjectionInfo.FromProj4String(_sourceProj4Params);
    public static ProjectionInfo TargetCRF = ProjectionInfo.FromProj4String(_targetProj4Params);

    // Left bottom starting corner
    private const double XLowerLeft = 0;
    private const double YLowerLeft = -4415.002329;
    
    // Information normal grid from source projection
    private const int Columns = 700;
    private const int Rows = 765;
    private const double CellWidth = 1.0000013;
    private const double CellHeight = 1.0000052;

    // Information pyramided grid from source projection
    private const int ColumnsPyr = 175;
    private const int RowsPyr = 192;
    private const double CellWidthPyr = 1.0000013 * 4;
    private const double CellHeightPyr = 1.0000052 * 4;

    // Generated grid singleton acces
    private static GridSingelton _grid = GridSingelton.Grid;

    // Precision of decimals in target projection
    private const int Precision = 5;
    
    public void GenerateCellGrids()
    {
        // Generate 
        _grid.AddGridCellList(GenerateGrid(Columns, Rows, CellWidth, CellHeight));
        _grid.AddPyramidedGridCellList(GenerateGrid(ColumnsPyr, RowsPyr, CellWidthPyr, CellHeightPyr));
    }

    /// <summary>
    /// Converts coordinates from epsg:4326 to WGS84. From WGS84 convert it to X and Y points in the dataset
    /// </summary>
    /// <param name="coords">array of coords in the projection epsg:4326</param>
    /// <returns>the converted coords X Y coords</returns>
    public static double[] Deconversion(double[] coords)
    {
        var numberOfCoordinates = new double[coords.Length / 2];
        Reproject.ReprojectPoints(coords, numberOfCoordinates, TargetCRF, SourceCRF, 0, numberOfCoordinates.Length);
        for (var i = 0; i < coords.Length; i++)
        {
            coords[i] = Math.Round(coords[i], Precision);
        }

        var cornerPointsXY = new List<double>();
        for (var i = 0; i < coords.Length; i+=2)
        {
            cornerPointsXY.Add((coords[i] + XLowerLeft) / CellWidthPyr);
            cornerPointsXY.Add(Math.Abs((coords[i+1] - YLowerLeft - RowsPyr * CellHeightPyr) / CellHeightPyr));
        }
        
        return cornerPointsXY.ToArray();
    }
    private List<GridCell> GenerateGrid(int columnAmount, int rowAmount, double cellWidth, double cellHeight)
    {
        // generate all points that make up cells
        double[,][] pointmap = new double[columnAmount + 1, rowAmount + 1][];
        for (int y = 0; y < rowAmount + 1; y++)
        {
            for (int x = 0; x < columnAmount + 1; x++)
            {
                pointmap[x, y] = PointCoordinatesConversion(new[]
                    // Y needs to be like this to make sure top left is 0,0
                    {XLowerLeft + x * cellWidth, YLowerLeft + rowAmount * cellHeight - y * cellHeight});
            }
        }

        // make cells from all points
        List<GridCell> gridCellList = new List<GridCell>();
        for (int y = 0; y < rowAmount; y++)
        {
            for (int x = 0; x < columnAmount; x++)
            {
                double[] cornerCoordinates = new double[8];

                // Lower left corner
                cornerCoordinates[0] = pointmap[x, y][0];
                cornerCoordinates[1] = pointmap[x, y][1];
                // Lower right corner
                cornerCoordinates[2] = pointmap[x + 1, y][0];
                cornerCoordinates[3] = pointmap[x + 1, y][1];
                // Top right corner
                cornerCoordinates[4] = pointmap[x + 1, y + 1][0];
                cornerCoordinates[5] = pointmap[x + 1, y + 1][1];
                // Top left corner
                cornerCoordinates[6] = pointmap[x, y + 1][0];
                cornerCoordinates[7] = pointmap[x, y + 1][1];

                gridCellList.Add(new GridCell(cornerCoordinates, x, y));
            }
        }

        return gridCellList;
    }
    private double[] PointCoordinatesConversion(double[] pointCoordinates)
    {
        double[] numberOfCoordinates = new double[pointCoordinates.Length / 2];
        Reproject.ReprojectPoints(pointCoordinates, numberOfCoordinates, SourceCRF, TargetCRF, 0,
            numberOfCoordinates.Length);
        for (int i = 0; i < pointCoordinates.Length; i++)
        {
            pointCoordinates[i] = Math.Round(pointCoordinates[i], Precision);
        }
        
        return pointCoordinates;
    }
}