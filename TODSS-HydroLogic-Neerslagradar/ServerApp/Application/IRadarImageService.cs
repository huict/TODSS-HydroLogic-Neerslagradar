using System.Drawing;
using Microsoft.AspNetCore.Mvc;
using TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public interface IRadarImageService
{
    IEnumerable<byte[]> loadData();
    IEnumerable<byte[]> GetSpecificSlices(WeatherFiltersDTO dto);

}