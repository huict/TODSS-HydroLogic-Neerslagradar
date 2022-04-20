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

    private const int precision = 6;
    public void ProvideGridCellCoordinates()
    {
        List<GridCell> gridCellList = new List<GridCell>();
        for (int y = 0; y < Rows; y++)
        {
            for (int x = 0; x < Columns; x++)
            {
                gridCellList.Add(new GridCell(Conversion(GenerateEdgeCoordinatesForCell(x, y)), x, y));
            }
        }
        
        _grid.AddGridCellList(gridCellList);
    }
    
    //TODO coordinates that should be on the same line aren't cause the conversion happens twice. This should be optimized
    public double[] Conversion(double[] edges)
    {
        double[] numberOfCoordinates = new double[edges.Length / 2];
        Reproject.ReprojectPoints(edges, numberOfCoordinates, SourceCRF, TargetCRF, 0, numberOfCoordinates.Length);
        for (int i = 0; i < edges.Length - 1; i++)
        {
            edges[i] = Math.Round(edges[i], precision);
        }
        return GenerateCornersFromEdges(edges);
    }
    
    // Generates the 8 corner coordinates from the 4 edge coordinates that are converted
    public double[] GenerateCornersFromEdges(double[] edgeCoordinates)
    {
        double[] cornerCoordinates = new double[8];
        
        // Lower left corner
        cornerCoordinates[0] = edgeCoordinates[0];
        cornerCoordinates[1] = edgeCoordinates[1];
        // Lower right corner
        cornerCoordinates[2] = edgeCoordinates[2];
        cornerCoordinates[3] = edgeCoordinates[1];
        // Top right corner
        cornerCoordinates[4] = edgeCoordinates[2];
        cornerCoordinates[5] = edgeCoordinates[3];
        // Top left corner
        cornerCoordinates[6] = edgeCoordinates[0];
        cornerCoordinates[7] = edgeCoordinates[3];

        return cornerCoordinates;
    }

    // Generates the 4 edge coordinates of a cell before convertion
    private double[] GenerateEdgeCoordinatesForCell(int x, int y)
    {
        double[] coordinates = new double[4];
        
        // left side
        coordinates[0] = XLowerLeft + x * CellWidth;
        // bottom side
        coordinates[1] = YLowerLeft + y * CellHeight;
        // right side
        coordinates[2] = XLowerLeft + (x + 1) * CellWidth;
        // top side
        coordinates[3] = YLowerLeft + (y + 1) * CellHeight;
        
        return coordinates;
    }
}