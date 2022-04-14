namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

public sealed class GridSingelton
{
    // Code needed for making it a singleton
    private static readonly GridSingelton grid = new GridSingelton();

    static GridSingelton()
    { 
    }
    private GridSingelton()
    {
    }

    public static GridSingelton Grid
    {
        get
        {
            return grid;
        }
    }
    
    // Variables
    private GridCell[] _gridCells = {};

    public GridCell[] GridCells
    {
        get { return _gridCells; }
    }

    // Functional code for providing cells
    public void AddGridCell(GridCell gridCell)
    {
        List<GridCell> gridCellList = _gridCells.ToList();

        gridCellList.Add(gridCell);

        _gridCells = gridCellList.ToArray();
    }

    public void AddGridCellList(List<GridCell> newGridCellList)
    {
        List<GridCell> oldGridCellList = _gridCells.ToList();

        oldGridCellList.AddRange(newGridCellList);

        _gridCells = oldGridCellList.ToArray();
    }

    public GridCell FindByGridCoordinates(int x, int y)
    {
        return _gridCells.First(i => i.X == x && i.Y == y);
    }
    
    public GridCell FindByGeoCoordinates(double[] coordinates)
    {
        return _gridCells.First(i => i.Coordinates == coordinates );
    }
    
}