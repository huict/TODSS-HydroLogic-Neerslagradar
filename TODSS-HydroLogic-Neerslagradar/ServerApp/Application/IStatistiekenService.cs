namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public interface IStatistiekenService
{
    long CalculateSum(int beginX, int beginY, int width, int height, long startTime, long endTime);
    double CalculateAverageRainFallPerCellInSelectionForPeriod(int beginX, int beginY, int width, int height, long startTime, long endTime);
    double CalculateAverageRainFallInCellForPeriod(int beginX, int beginY, int width, int height, long startTime, long endTime);
    
}