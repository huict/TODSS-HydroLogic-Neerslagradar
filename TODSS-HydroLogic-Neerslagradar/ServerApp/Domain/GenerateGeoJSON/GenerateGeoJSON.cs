using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.GenerateGeoJSON;

public class GenerateGeoJSON
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
        for (int i = 0; i < width; i++)
        {
            for (int j = 0; j < height; j++)
            {
                var coords = Grid.FindByGridCoordinatesPyramided(i, j);
                var geoDataDto = new GeoDataDTO
                {
                    id = index,
                    intensity = slice[0, j, i]
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
    /// <returns>A list filled with GeoData where every cell in the grid an intensity and the corner coords have.</returns>
    public static List<GeoDataDTO> ReduceCoords(int combineAmountOfFields, float[,,] slice, int optionalBeginIndex = -1)
    {
        var geoDataDtoList = new List<GeoDataDTO>();
        var width = slice.GetLength(2);
        var height = slice.GetLength(1);
        var widthToWide = width % combineAmountOfFields;
        var heightToHigh = height % combineAmountOfFields;
        var index = optionalBeginIndex;
        for (var i = 0; i < width - widthToWide; i+=combineAmountOfFields)
        {
            for (var j = 0; j < height - heightToHigh; j+=combineAmountOfFields)
            {
                var gridCells = CollectGridCells(i, j, combineAmountOfFields);
                index++;
                var intensity = gridCells.Average(cell => slice[0, cell.Y, cell.X]);
                if (intensity<=0)continue;
                var geoDataDto = new GeoDataDTO
                {
                    id = index,
                    intensity = intensity
                };
                geoDataDtoList.Add(geoDataDto);
            }
        }
        return geoDataDtoList;
    }

    public static List<GridCellDTO> ReduceGridcells(int combineAmountOfCells, int height, int width)
    {
        var geoDataDtoList = new List<GridCellDTO>();
        var widthToWide = width % combineAmountOfCells;
        var heightToHigh = height % combineAmountOfCells;
        var index = 0;
        for (var i = 0; i < width - widthToWide; i += combineAmountOfCells)
        {
            for (var j = 0; j < height - heightToHigh; j += combineAmountOfCells)
            {
                var gridCells = CollectGridCells(i, j, combineAmountOfCells);
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

    private static List<GridCell> CollectGridCells(int beginI, int beginJ, int combineAmount)
    {
        var gridCells = new List<GridCell>();
        for (var k = beginI; k < beginI + combineAmount; k++)
        {
            for (var l = beginJ; l < beginJ + combineAmount; l++)
            {
                gridCells.Add(Grid.FindByGridCoordinatesPyramided(k, l));
            }
        }
        return gridCells;
    }
}