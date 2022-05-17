namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public interface IStatistiekenService
{
    int CalculateSum();
    double CalculateAverageRainFallPerCellInSelectionForPeriod(long startTime, long endTime);
    double CalculateAverageRainFallInCellForPeriod(int x, int y, long startTime, long endTime);
    
}