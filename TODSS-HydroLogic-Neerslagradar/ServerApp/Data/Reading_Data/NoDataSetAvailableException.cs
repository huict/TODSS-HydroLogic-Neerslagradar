namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Data.Reading_Data;

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