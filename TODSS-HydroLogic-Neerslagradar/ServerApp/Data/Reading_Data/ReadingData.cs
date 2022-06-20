﻿using Microsoft.Research.Science.Data;

namespace TODSS_HydroLogic_Neerslagradar.ServerApp.Domain.Reading_Data;

public class ReadingData : IReadingData
{
    private DataSet Ds { get; }
    private Variable _p;
    private int Y, X, Time;

    public ReadingData(string filePath)
    {
        Ds = DataSet.Open(filePath, ResourceOpenMode.ReadOnly);
        foreach (var variable in Ds.Variables)
        {
            if (variable.Name != "P") continue;
            _p = variable;
            foreach (var dimension in variable.Dimensions)
            {
                switch (dimension.Name)
                {
                    case "time" : 
                        Time = dimension.Length;
                        break;
                    case "x":
                        X = dimension.Length;
                        break;
                    case "y" :
                        Y = dimension.Length;
                        break;
                }
            }
            break;
        }
    }

    public int GetTotalWidth()
    {
        return X;
    }

    public int GetTotalHeight()
    {
        return Y;
    }

    public int GetMaxDepth()
    {
        return Time;
    }

    /// <summary>
    ///     Gets one slice of the dataset
    /// </summary>
    /// <param name="z">Which slice you want in terms of time depth</param>
    /// <returns>One whole slice of the dataset on a specific depth</returns>
    public float[,,] GetSliceWithDepth(int z)
    {
        return GetSlicesWithCoordsAreaAndDepth(0, 0, z, X, Y, 1);
    }
    /// <summary>
    ///   Gets one slice of the dataset
    /// </summary>
    /// <param name="x">Begin value on the x-axis of the wanted data</param>
    /// <param name="y">Begin value on the y-axis of the wanted data</param>
    /// <param name="z">Begin value for the time </param>
    /// <param name="width">starting from x how wide the data is going to be</param>
    /// <param name="height">starting from y how high the data is going to be</param>
    /// <returns>One slice with the given height, width and z (depth) </returns>
    public float[,,] GetSliceWithCoordsAndArea(int x, int y, int z, int width, int height)
    {
        return GetSlicesWithCoordsAreaAndDepth(x, y, z, width, height, 1);
    }

    /// <summary>
    ///     Gets multiple slice according to the parameters
    /// </summary>
    /// <param name="x">Begin value on the x-axis of the wanted data</param>
    /// <param name="y">Begin value on the y-axis of the wanted data</param>
    /// <param name="z">Begin value for the time </param>
    /// <param name="width">starting from x how wide the data is going to be</param>
    /// <param name="height">starting from y how high the data is going to be</param>
    /// <param name="depth">How many slices you want starting from z</param>
    /// <returns>Multiple slices with the specified width, height, and depth</returns>
    public float[,,] GetSlicesWithCoordsAreaAndDepth(int x, int y, int z, int width, int height, int depth)
    {
        return (float[,,])_p.GetData(new []{z, y, x},null , new []{depth, height, width});
    }
}
