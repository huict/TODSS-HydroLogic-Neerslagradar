using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application.GenerateGeoData;

public class GenerateDataDTOs
{
    private static readonly GridSingelton Grid = GridSingelton.Grid;

    /// <summary>
    /// Converts a 3 dimensional array to a list with Geodata. 
    /// </summary>
    /// <param name="slice">one slice where only the width and height matters</param>
    /// <returns>A list filled with GeoData where every cell in the grid an intensity and the corner coords have.</returns>
    public static List<GeoDataDTO> GenerateGeo(float[,,] slice)
    {
        var geoDataDtoList = new List<GeoDataDTO>();
        var width = slice.GetLength(2);
        var height = slice.GetLength(1);
        var index = 0;


        for (var y = 0; y < height; y++)
        for (var x = 0; x < width; x++)
        {
            var geoDataDto = new GeoDataDTO
            {
                id = index,
                intensity = slice[0, y, x]
            };
            geoDataDtoList.Add(geoDataDto);
            index++;
        }

        return geoDataDtoList;
    }

    /// <summary>
    /// Compresses the data with a given amount eg. if combineAmountOfFields is 4 the data is compressed 8 times.
    /// </summary>
    /// <param name="pyramidingAmount">The amount of cells you want to merge to make one big one.</param>
    /// <param name="slice">one slice where only the width and height matters</param>
    /// <param name="optionalBeginIndex">Optional parameter to determine which index the top left cell is. Used when you return a piece of the slice</param>
    /// <returns>A list filled with GeoData where every cell in the grid an intensity and the corner coords have.</returns>
    public static List<GeoDataDTO> ReduceGeoData(int pyramidingAmount, float[,,] slice, int optionalBeginIndex = 0)
    {
        if (pyramidingAmount <= 1) return GenerateGeo(slice);
        var geoDataDtoList = new List<GeoDataDTO>();
        var width = slice.GetLength(2);
        var height = slice.GetLength(1);
        var widthToWide = width % pyramidingAmount;
        var heightToHigh = height % pyramidingAmount;
        var index = optionalBeginIndex;

        for (var y = 0; y < height - heightToHigh; y += pyramidingAmount)
        for (var x = 0; x < width - widthToWide; x += pyramidingAmount)
        {
            var gridCells = CollectGridCells(y, x, pyramidingAmount);
            var intensity = gridCells.Average(cell => slice[0, cell.Y, cell.X]);
            if (intensity <= 0)
            {
                index++;
                continue;
            }

            var geoDataDto = new GeoDataDTO
            {
                id = index,
                intensity = intensity
            };
            index++;
            geoDataDtoList.Add(geoDataDto);
        }

        return geoDataDtoList;
    }

    /// <summary>
    /// Compresses the amount of gridcells in a given height and width. Each cell has an id which is the same in <see cref="ReduceGeoData"/> so the coordinates should be the same given the same id and combineAmountOfCells.
    /// </summary>
    /// <param name="pyramidingAmount">The size of the square that will be put in the pyramided cell.</param>
    /// <param name="height">The height of the dataset. You want the cells for</param>
    /// <param name="width">The width of the dataset. You want the cells for</param>
    /// <returns>A list of <see cref="GridCellDTO"/> which is either compressed or not.</returns>
    public static List<GridCellDTO> ReduceGridcells(int pyramidingAmount, int height = 192, int width = 175)
    {
        var geoDataDtoList = new List<GridCellDTO>();
        var widthToWide = width % pyramidingAmount;
        var heightToHigh = height % pyramidingAmount;
        var index = 0;


        for (var y = 0; y < height - heightToHigh; y += pyramidingAmount)
        for (var x = 0; x < width - widthToWide; x += pyramidingAmount)
        {
            var gridCells = CollectGridCells(y, x, pyramidingAmount);
            var coordTopLeft = new[] {gridCells[0].Coordinates[0], gridCells[0].Coordinates[1]};
            var coordTopRight = new[] {gridCells[pyramidingAmount - 1].Coordinates[2], gridCells[pyramidingAmount - 1].Coordinates[3]};
            var coordBotRight = new[] {gridCells[^1].Coordinates[4], gridCells[^1].Coordinates[5]};
            var coordBotLeft = new[] {gridCells[^pyramidingAmount].Coordinates[6], gridCells[^pyramidingAmount].Coordinates[7]};

            var cellDto = new GridCellDTO()
            {
                coords = GridCell.GenerateCoordsGeoJson(coordTopLeft.Concat(coordTopRight).Concat(coordBotRight)
                    .Concat(coordBotLeft).ToArray()),
                id = index
            };
            geoDataDtoList.Add(cellDto);
            index++;
        }

        return geoDataDtoList;
    }

    /// <summary>
    /// Gives back all the cells that are in a pyramided gridcell based on id
    /// </summary>
    /// <param name="gridWidth">The height of the data grid</param>
    /// <param name="pyramidingAmount">The amount of pyramiding</param>
    /// <param name="id">Id of the cell</param>
    /// <returns>A list of all gridcells found in the pyramided gridcell</returns>
    public static List<GridCell> ConvertFromIdToGridCells(int gridWidth, int pyramidingAmount, int id)
    {
        if (pyramidingAmount <= 1)
        {
            pyramidingAmount = 1;
        }

        int widthToWide = gridWidth % pyramidingAmount;
        int pyramidedWidth = (gridWidth - widthToWide) / pyramidingAmount;
        // Given id = pyramdidedY * pyramidedWidth + pyramdidedx
        // Means y = rounddown(index / width) * pyramidingAmount 
        int y = id / pyramidedWidth * pyramidingAmount; //Integer division rounds down
        // And means x = index % width * pyramidingAmount 
        int x = id % pyramidedWidth * pyramidingAmount;
        
        var gridCells = new List<GridCell>();
        for (var currenty = y; currenty < y + pyramidingAmount; currenty++)
        for (var currentx = x; currentx < x + pyramidingAmount; currentx++)
        {
            gridCells.Add(Grid.FindByGridCoordinatesPyramided(currentx, currenty));
        }

        return gridCells;
    }

    /// <summary>
    ///     Collects all the gridcells in a given area
    /// </summary>
    /// <param name="beginY">Where to start looking for gridcells on the y-axis</param>
    /// <param name="beginX">Where to start looking for gridcells on the x-asis</param>
    /// <param name="collectionSize">The width and height of the selection</param>
    /// <returns>A list of gridcells in the selected area</returns>
    private static List<GridCell> CollectGridCells(int beginY, int beginX, int collectionSize)
    {
        var gridCells = new List<GridCell>();
        
        for (var y = beginY; y < beginY + collectionSize; y++)
        for (var x = beginX; x < beginX + collectionSize; x++)
        {
            gridCells.Add(Grid.FindByGridCoordinatesPyramided(x, y));
        }
        
        return gridCells;
    }
}