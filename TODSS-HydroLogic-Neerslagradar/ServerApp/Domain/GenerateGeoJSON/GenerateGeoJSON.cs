﻿using System.Drawing;
using Rewrite_NetCdf_test.classes.colorSchemes;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.CoordinateConversion;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.GenerateGeoJSON;

public class GenerateGeoJSON
{
    private static readonly GridSingelton Grid = GridSingelton.Grid;
    
    public static List<GeoDataDTO> GenerateGeo(float[,,] slice, IColorScheme scheme )
    {
        var geoData = new List<GeoDataDTO>();
        var width = slice.GetLength(2);
        var height = slice.GetLength(1);
        for (int i = 0; i < width; i++)
        {
            for (int j = 0; j < height; j++)
            {
                var geoDataDto = new GeoDataDTO
                {
                    coords = Grid.FindByGridCoordinatesPyramided(i, j).coordsForGeoJson,
                    color = ColorTranslator.ToHtml(scheme.GetColorValue(slice[0, j, i]))
                };
                geoData.Add(geoDataDto);
            }
        }

        return geoData;
    }
}