using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.TimeConversion;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Application;

public class StatistiekenService : IStatistiekenService
{
    private IRadarImageService RadarImageService;
    

    public long CalculateSum(int beginX, int beginY, int width, int height, long startTime, long endTime)
    {
        int beginDepth = TimeConversion.GetDepthFromSeconds(startTime);
        int endDepth = TimeConversion.GetDepthFromSeconds(endTime);

        long sum = 0;
        
        for (int depth = beginDepth; depth < endDepth; depth++)
        {
            
        }
        
        return sum;
    }

    public double CalculateAverageRainFallPerCellInSelectionForPeriod(int beginX, int beginY, int width, int height,
        long startTime, long endTime)
    {
        throw new NotImplementedException();
    }

    public double CalculateAverageRainFallInCellForPeriod(int beginX, int beginY, int width, int height, long startTime,
        long endTime)
    {
        throw new NotImplementedException();
    }
}