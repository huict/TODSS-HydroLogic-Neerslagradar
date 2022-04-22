namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.TimeConversion;

public class TimeConversion
{
    
    public static int GetDepthFromSeconds(long timestamplong)
    {
        var depth = 0;
        var dtDateTime = new DateTime(1970,1,1,0,0,0,0,DateTimeKind.Local);
        dtDateTime = dtDateTime.AddSeconds( timestamplong ).ToLocalTime();
        depth += dtDateTime.Hour*12;
        depth += dtDateTime.Minute / 5;
        return depth;
    }
}