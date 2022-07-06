namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;

public sealed class GridSingelton
{
    // Code needed for making it a singleton
    private static readonly GridSingelton _Grid = new GridSingelton();

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
            return _Grid;
        }
    }
    
    // Variables
    private GridCell[] _gridCells = Array.Empty<GridCell>();

    private GridCell[] _gridCellsPyramided = Array.Empty<GridCell>();

    /// <summary>
    ///    A list of gridcells containing all the cells in the pyramided grid
    /// </summary>
    public GridCell[] GridCellsPyramided
    {
        get { return _gridCellsPyramided; }
    }
    
    /// <summary>
    ///     A list of gridcells containing all the cells in the original grid
    /// </summary>
    public GridCell[] GridCells
    {
        get { return _gridCells; }
    }

    // Functional code for providing cells
    /// <summary>
    ///  Adds a gridcell to the original grid
    /// </summary>
    /// <param name="gridCell">Gridcell to add</param>
    public void AddGridCell(GridCell gridCell)
    {
        List<GridCell> gridCellList = _gridCells.ToList();

        gridCellList.Add(gridCell);

        _gridCells = gridCellList.ToArray();
    }

    /// <summary>
    ///     Adds a list of gridcells to the original grid
    /// </summary>
    /// <param name="newGridCellList">List of gridcells to add</param>
    public void AddGridCellList(List<GridCell> newGridCellList)
    {
        List<GridCell> oldGridCellList = _gridCells.ToList();

        oldGridCellList.AddRange(newGridCellList);

        _gridCells = oldGridCellList.ToArray();
    }

    /// <summary>
    ///     Add a list of gridcells to the pyramided grid
    /// </summary>
    /// <param name="newPyramidedGridCellList">Lists of gridcells to add</param>
    public void AddPyramidedGridCellList(List<GridCell> newPyramidedGridCellList)
    {
        List<GridCell> oldGridCellList = _gridCellsPyramided.ToList();

        oldGridCellList.AddRange(newPyramidedGridCellList);

        _gridCellsPyramided = oldGridCellList.ToArray();
    }
    
    /// <summary>
    ///     Finds a gridcell in the original grid by X,Y
    /// </summary>
    /// <param name="x">X of gridcell</param>
    /// <param name="y">Y of gridcell</param>
    /// <returns>The found gridcell</returns>
    public GridCell FindByGridCoordinates(int x, int y)
    {
        var index = y * 700 + x;
        return _gridCells[index];
    }

    /// <summary>
    ///     Finds a a gridcell in the pyramided grid by X,Y
    /// </summary>
    /// <param name="x">X of the gridcell</param>
    /// <param name="y">Y of the gridcell</param>
    /// <returns></returns>
    public GridCell FindByGridCoordinatesPyramided(int x, int y)
    {
        var index = y * 175 + x;
        return _gridCellsPyramided[index];
    }
}