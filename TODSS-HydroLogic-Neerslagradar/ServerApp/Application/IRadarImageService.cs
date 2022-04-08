using System.Drawing;
using Microsoft.AspNetCore.Mvc;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public interface IRadarImageService
{
    List<byte[]> loadData();
    
}