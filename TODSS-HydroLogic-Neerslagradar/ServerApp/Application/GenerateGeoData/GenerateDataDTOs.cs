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
        for (var x = 0; x < width; x++)
        {
            for (var y = 0; y < height; y++)
            {
                var geoDataDto = new GeoDataDTO
                {
                    id = index,
                    intensity = slice[0, y, x]
                };
                geoDataDtoList.Add(geoDataDto);
                index++;
            }
        }
        return geoDataDtoList;
    }

    /// <summary>
    /// Compresses the data with a given amount eg. if combineAmountOfFields is 4 the data is compressed 8 times.
    /// </summary>
    /// <param name="combineAmountOfFields">The amount of cells you want to merge to make one big one.</param>
    /// <param name="slice">one slice where only the width and height matters</param>
    /// <param name="optionalBeginIndex">Optional parameter to determine which index the top left cell is. Used when you return a piece of the slice</param>
    /// <returns>A list filled with GeoData where every cell in the grid an intensity and the corner coords have.</returns>
    public static List<GeoDataDTO> ReduceGeoData(int combineAmountOfFields, float[,,] slice, int optionalBeginIndex = 0)
    {
        if (combineAmountOfFields <= 1) return GenerateGeo(slice);
        var geoDataDtoList = new List<GeoDataDTO>();
        var width = slice.GetLength(2);
        var height = slice.GetLength(1);
        var widthToWide = width % combineAmountOfFields;
        var heightToHigh = height % combineAmountOfFields;
        var index = optionalBeginIndex;
        for (var x = 0; x < width - widthToWide; x+=combineAmountOfFields)
        {
            for (var y = 0; y < height - heightToHigh; y+=combineAmountOfFields)
            {
                var gridCells = CollectGridCells(y, x, combineAmountOfFields);
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
        }
        return geoDataDtoList;
    }

    /// <summary>
    /// Compresses the amount of gridcells in a given height and width. Each cell has an id which is the same in <see cref="ReduceGeoData"/> so the coordinates should be the same given the same id and combineAmountOfCells.
    /// </summary>
    /// <param name="combineAmountOfCells">The amount of cells you want to merge to make one big one. </param>
    /// <param name="height">The height of the dataset. You want the cells for</param>
    /// <param name="width">The width of the dataset. You want the cells for</param>
    /// <returns>A list of <see cref="GridCellDTO"/> which is either compressed or not.</returns>
    public static List<GridCellDTO> ReduceGridcells(int combineAmountOfCells, int height, int width)
    {
        var geoDataDtoList = new List<GridCellDTO>();
        var widthToWide = width % combineAmountOfCells;
        var heightToHigh = height % combineAmountOfCells;
        var index = 0;
        for (var x = 0; x < width - widthToWide; x += combineAmountOfCells)
        {
            for (var y = 0; y < height - heightToHigh; y += combineAmountOfCells)
            {
                var gridCells = CollectGridCells(y, x, combineAmountOfCells);
                var coordTopLeft = new[] {gridCells[0].Coordinates[0], gridCells[0].Coordinates[1]};
                var coordTopRight = new[] {gridCells[^combineAmountOfCells].Coordinates[2], gridCells[^combineAmountOfCells].Coordinates[3]};
                var coordBotRight = new[] {gridCells[^1].Coordinates[4], gridCells[^1].Coordinates[5]};
                var coordBotLeft = new[] {gridCells[combineAmountOfCells - 1].Coordinates[6], gridCells[combineAmountOfCells - 1].Coordinates[7]};
                var cellDto = new GridCellDTO()
                {
                    coords = GridCell.GenerateCoordsGeoJson(coordTopLeft.Concat(coordTopRight).Concat(coordBotRight).Concat(coordBotLeft).ToArray()),
                    id = index
                };
                geoDataDtoList.Add(cellDto);
                index++;
            }
        }

        return geoDataDtoList;
    }
    /// <summary>
    /// Gives back all the cells that are in a pyramided gridcell
    /// </summary>
    /// <param name="pyramidedGridHeight">The height of pyramided grid</param>
    /// <param name="combineAmount">The amount of pyramiding</param>
    /// <param name="id">Id of the cell</param>
    /// <returns></returns>
    public static List<GridCell> ConvertFromIdToGridCells(int pyramidedGridHeight, int combineAmount, int id)
    {
        int heightToHigh = pyramidedGridHeight % combineAmount;
        int pyramidedHeight = (pyramidedGridHeight - heightToHigh) / combineAmount;

        // Given id = x * height + y
        // Means x = rounddown(index / height) 
        int x = id / pyramidedHeight; //Integer division rounds down
        // And means y = index % height
        int y = id % pyramidedHeight;
        
        var gridCells = new List<GridCell>();
        for (var currentx = x; x < x + combineAmount; x++)
        {
            for (var currenty = y; y < y + combineAmount; y++)
            {
                gridCells.Add(Grid.FindByGridCoordinatesPyramided(currentx, currenty));
            }
        }

        return gridCells;
    }

    /// <summary>
    ///     Collects all the gridcells in a given area
    /// </summary>
    /// <param name="beginY">Where to start looking for gridcells on the y-axis</param>
    /// <param name="beginX">Where to start looking for gridcells on the x-asis</param>
    /// <param name="combineAmount">The width and height of selection</param>
    /// <returns>A list of gridcells in the selected area</returns>
    private static List<GridCell> CollectGridCells(int beginY, int beginX, int combineAmount)
    {
        var gridCells = new List<GridCell>();
        for (var x = beginX; x < beginX + combineAmount; x++)
        {
            for (var y = beginY; y < beginY + combineAmount; y++)
            {
                gridCells.Add(Grid.FindByGridCoordinatesPyramided(x, y));
            }
        }

        return gridCells;
    }

}