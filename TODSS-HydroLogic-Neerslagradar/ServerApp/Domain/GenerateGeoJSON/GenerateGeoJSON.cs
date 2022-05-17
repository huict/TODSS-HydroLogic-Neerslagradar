using Microsoft.AspNetCore.Mvc.Diagnostics;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.GenerateGeoJSON;

public class GenerateGeoJSON
{
    private static readonly GridSingelton Grid = GridSingelton.Grid;
    
    public static List<GeoDataDTO> GenerateGeo(float[,,] slice)
    {
        var geoDataDtoList = new List<GeoDataDTO>();
        var width = slice.GetLength(2);
        var height = slice.GetLength(1);
        for (int i = 0; i < width; i++)
        {
            for (int j = 0; j < height; j++)
            {
                var coords = Grid.FindByGridCoordinatesPyramided(i, j);
                var geoDataDto = new GeoDataDTO
                {
                    coords = coords.coordsForGeoJson,
                    intensity = slice[0, j, i]
                };
                geoDataDtoList.Add(geoDataDto);
            }
        }
        return geoDataDtoList;
    }

    public static List<GeoDataDTO> ReduceCoords(int combineAmountOfFields, float[,,] slice)
    {
        var geoDataDtoList = new List<GeoDataDTO>();
        var width = slice.GetLength(2);
        var height = slice.GetLength(1);
        var widthToWide = width % combineAmountOfFields;
        var heightToHigh = height % combineAmountOfFields;

        for (int i = 0; i < width - widthToWide; i+=combineAmountOfFields)
        {
            for (int j = 0; j < height - heightToHigh; j+=combineAmountOfFields)
            {
                List<GridCell> gridCells = new List<GridCell>();
                for (int k = i; k < i+combineAmountOfFields; k++)
                {
                    for (int l = j; l < j+combineAmountOfFields; l++)
                    {
                        gridCells.Add(Grid.FindByGridCoordinatesPyramided(k,l));
                    }
                }
                var intensity = gridCells.Sum(cell => slice[0, cell.Y, cell.X]);
                // if (intensity<=0)continue;
                var coordTopLeft = new [] {gridCells[0].Coordinates[0], gridCells[0].Coordinates[1]};
                var coordTopRight = new [] {gridCells[^combineAmountOfFields ].Coordinates[2], gridCells[^combineAmountOfFields].Coordinates[3]};
                var coordBotRight = new []{gridCells[^1].Coordinates[4], gridCells[^1].Coordinates[5]};
                var coordBotLeft = new [] {gridCells[combineAmountOfFields-1].Coordinates[6], gridCells[combineAmountOfFields-1].Coordinates[7]};
                var geoDataDto = new GeoDataDTO
                {
                    coords = GridCell.GenerateCoordsGeoJson(coordTopLeft.Concat(coordTopRight).Concat(coordBotRight).Concat(coordBotLeft).ToArray()),
                    intensity = intensity
                };
                geoDataDtoList.Add(geoDataDto);
            }
        }

        return geoDataDtoList;
    }
}