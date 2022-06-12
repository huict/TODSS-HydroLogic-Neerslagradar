using TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.Reading_Data;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.TimeConversion;

public class TimeConversion
{
    private static readonly ReadingData October2021 = new ("Knmi.Radar.Uncorrected_P_2021-10-01T00h00m00s_2021-11-01T00h00m00s.nc");
    private static readonly ReadingData June182021 = new ("neerslag_data.nc");
    public static int GetDepthFromSeconds(long timestamplong)
    {
        var depth = 0;
        var dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Local);
        dtDateTime = dtDateTime.AddSeconds(timestamplong).ToLocalTime();
        depth += dtDateTime.Hour * 12;
        depth += dtDateTime.Minute / 5;
        return depth;
    }
    
    public static (ReadingData dataSet, int beginDepth, int endDepth) GetDatasetAndDepthFromSeconds(long startSeconds, long endSeconds)
    {
        var beginTime = GetDateTimeFromSeconds(startSeconds);
        var endTime = GetDateTimeFromSeconds(endSeconds);
        if (beginTime > endTime) throw new TimeException("Begin time is after end time ");
        return beginTime.Year switch
        {
            2021 when beginTime.Month == 10 && endTime.Month == 10 => 
                (dataSet: October2021, beginDepth: CalculateDepth(true, beginTime), endDepth:CalculateDepth(true, endTime)),
            2021 when beginTime.Month == 6 && endTime.Month == 6  && beginTime.Day == 18 && endTime.Day == 18
                => (dataSet: June182021, beginDepth: CalculateDepth(false, beginTime), endDepth:CalculateDepth(false, endTime)),
            _ => throw new NoDataSetAvailable($"No dataset available for the given time {beginTime} {startSeconds}  {endTime} {endSeconds}")
        };
    }

    private static int CalculateDepth(bool month, DateTime time)
    {
        var depth = 0;
        if (month) depth += time.Day * 288;
        depth += time.Hour * 12;
        depth += time.Minute / 5;
        return depth;

    }

    private static DateTime GetDateTimeFromSeconds(long timestamplong)
    {
        var dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Local);
        return dtDateTime.AddSeconds(timestamplong).ToLocalTime();
        
    }
}