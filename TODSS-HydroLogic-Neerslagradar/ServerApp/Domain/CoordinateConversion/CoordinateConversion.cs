using DotSpatial.Projections;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

/// <summary>
///     Handles conversion from the projection the data uses to the projection used by the front-end.
///     Is called at startup to fill the grid with cells
/// </summary>
public class CoordinateConversion
{
    //Data projection information as a Proj4 string
    private static string _sourceProj4Params = "+proj=stere +lat_0=90 +lat_ts=60 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378.14 +b=6356.75";
    //Front-end projection information as a Proj4 string
    private static string _targetProj4Params = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

    //Actuall projection objects
    public static ProjectionInfo SourceCRF = ProjectionInfo.FromProj4String(_sourceProj4Params);
    public static ProjectionInfo TargetCRF = ProjectionInfo.FromProj4String(_targetProj4Params);

    // Left bottom starting corner coordinate for the grid in data projection
    private const double XLowerLeft = 0;
    private const double YLowerLeft = -4415.002329;
    
    // Information original grid from data projection
    private const int Columns = 700;
    private const int Rows = 765;
    private const double CellWidth = 1.0000013;
    private const double CellHeight = 1.0000052;

    // Information pyramided grid from data projection
    private const int ColumnsPyr = 175;
    private const int RowsPyr = 192;
    private const double CellWidthPyr = 1.0000013 * 4;
    private const double CellHeightPyr = 1.0000052 * 4;

    // Generated grid singleton acces
    private static GridSingelton _grid = GridSingelton.Grid;

    // Precision of decimals in target projection. Used during conversion
    private const int Precision = 5;
    
    /// <summary>
    ///     Fills the original grid and the pyramided grid with cells. Is called at startup
    /// </summary>
    public void GenerateCellGrids()
    {
        // Generate 
        _grid.AddGridCellList(GenerateGrid(Columns, Rows, CellWidth, CellHeight));
        _grid.AddPyramidedGridCellList(GenerateGrid(ColumnsPyr, RowsPyr, CellWidthPyr, CellHeightPyr));
    }

    /// <summary>
    ///     Generates all the cells in a grid based on given information. This generated grid is the target projection
    /// </summary>
    /// <param name="columnAmount">Amount of columns in the grid</param>
    /// <param name="rowAmount">Amount of rows in the grid</param>
    /// <param name="cellWidth">The width of a cell/column in data projection</param>
    /// <param name="cellHeight">The height of a cell/row in data projection</param>
    /// <returns>A list of gridcells that are in the grid</returns>
    private List<GridCell> GenerateGrid(int columnAmount, int rowAmount, double cellWidth, double cellHeight)
    {
        // generate all points that make up cells in the grid in target projection
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

        // Makes cells from all the generated points
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
    
    /// <summary>
    ///     Returns the given coordinates in the target projection
    /// </summary>
    /// <param name="pointCoordinates"></param>
    /// <returns></returns>
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