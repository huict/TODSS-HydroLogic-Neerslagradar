using TODSS_HydroLogic_Neerslagradar.ServerApp.Data.Reading_Data;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.TimeConversion;

public static class TimeConversion
{
    private static readonly IReadingData? October2021;
    private static readonly IReadingData? June182021;

    static TimeConversion()
    {
        if (File.Exists("Knmi.Radar.Uncorrected_P_2021-10-01T00h00m00s_2021-11-01T00h00m00s.nc"))
        {
            October2021 = new ReadingData("Knmi.Radar.Uncorrected_P_2021-10-01T00h00m00s_2021-11-01T00h00m00s.nc");
        }
        if (File.Exists("neerslag_data.nc"))
        {
            June182021 = new ReadingData("neerslag_data.nc");
        }
        
    }
    //todo delete this function
    public static int GetDepthFromSeconds(long timestamplong)
    {
        var depth = 0;
        var dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Local);
        dtDateTime = dtDateTime.AddMilliseconds(timestamplong).ToLocalTime();
        depth += dtDateTime.Hour * 12;
        depth += dtDateTime.Minute / 5;
        return depth;
    }
    
    /// <summary>
    ///     Uses begin and end timestamps to determine which dataset to use and where to begin / end the collection
    ///     in the dataset
    /// </summary>
    /// <param name="startTimestamp">TimeStamp in milliseconds where to begin the search for the weather data</param>
    /// <param name="endTimestamp">TimeStamp in milliseconds where to end the search</param>
    /// <returns>The Dataset that contains the needed data and the begin- and endDepth to fetch the data</returns>
    /// <exception cref="TimeException">Thrown when th beginTime is after the endTime</exception>
    /// <exception cref="NoDataSetAvailable">Thrown when there is no available dataset for the specified time</exception>
    public static (IReadingData dataSet, int beginDepth, int endDepth) GetDatasetAndDepthFromSeconds(long startTimestamp, long endTimestamp)
    {
        var beginTime = GetDateTimeFromSeconds(startTimestamp);
        var endTime = GetDateTimeFromSeconds(endTimestamp);
        if (beginTime > endTime) throw new TimeException("Begin time is after end time ");
        switch (beginTime.Year)
        {
            case 2021 when beginTime.Month == 10 && endTime.Month == 10:
                if (October2021 == null) throw new NoDataSetAvailable("Dataset for October 2021 is not present");
                return (dataSet: October2021, beginDepth: CalculateDepth(true, beginTime), endDepth: CalculateDepth(true, endTime));
            case 2021 when beginTime.Month == 6 && beginTime.Day == 18:
                if (June182021 == null) throw new NoDataSetAvailable("Dataset for June 18th 2021 is not present");
                var endDepth = CalculateDepth(false, endTime);
                if (endDepth >= June182021.GetMaxDepth() - 1 || endDepth == 0) endDepth = June182021.GetMaxDepth() - 1;
                return (dataSet: June182021, beginDepth: CalculateDepth(false, beginTime), endDepth );
            default:
                throw new NoDataSetAvailable(
                    $"No dataset available for the given time {beginTime} {startTimestamp}  {endTime} {endTimestamp}");
        }
    }

    /// <summary>
    ///     Calculates the depth to know where to begin in the DataSet
    /// </summary>
    /// <param name="month">If the file is a whole month</param>
    /// <param name="time">The time to calculate the depth</param>
    /// <returns></returns>
    private static int CalculateDepth(bool month, DateTime time)
    {
        var depth = 0;
        if (month) depth += time.Day * 288;
        depth += time.Hour * 12;
        depth += time.Minute / 5;
        return depth;

    }

    /// <summary>
    ///     Converts milliseconds to a DateTime object
    /// </summary>
    /// <param name="timestamplong"> A TimeStamp in milliseconds</param>
    /// <returns>The date that corresponds with the milliseconds</returns>
    private static DateTime GetDateTimeFromSeconds(long timestamplong)
    {
        var dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Local);
        return dtDateTime.AddMilliseconds(timestamplong).ToLocalTime();
        
    }
}