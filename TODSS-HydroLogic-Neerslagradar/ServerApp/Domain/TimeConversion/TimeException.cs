namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.TimeConversion;

public class TimeException : Exception
{
    public TimeException()
    {
        
    }

    public TimeException(string message) : base(message)
    {
        
    }

    public TimeException(string message, Exception inner) : base(message, inner)
    {
        
    }
}