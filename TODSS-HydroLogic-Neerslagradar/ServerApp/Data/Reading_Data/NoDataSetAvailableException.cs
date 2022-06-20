namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.Reading_Data;

public class NoDataSetAvailable : Exception
{
    public NoDataSetAvailable()
    {
        
    }

    public NoDataSetAvailable(string message) : base(message)
    {
        
    }

    public NoDataSetAvailable(string message, Exception inner) : base(message, inner)
    {
        
    }
}