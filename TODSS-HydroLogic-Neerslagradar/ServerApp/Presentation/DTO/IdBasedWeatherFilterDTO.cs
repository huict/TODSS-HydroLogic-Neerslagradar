﻿namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Presentation.DTO;

public class IdBasedWeatherFilterDTO
{   
    public List<int>  ids { get; set; }
    
    public bool LargeDataset { get; set; }
    public int CombineFields { get; set; }
    public long StartSeconds { get; set; }
    public long EndSeconds { get; set; }
}