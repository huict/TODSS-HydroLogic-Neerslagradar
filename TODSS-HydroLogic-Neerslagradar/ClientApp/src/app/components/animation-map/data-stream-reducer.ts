import {Injectable} from "@angular/core";

/**
 * Voor het reduceren van data die is opgehaald vanuit een request. Dit is om minder data op te slaan en te renderen.
 */
@Injectable({providedIn:"root"})
export class DataStreamReducer {
  public reduceCoords(combineAmountOfFields:number, data:number[][], dataWidth:number, dataHeight:number):number[][] {
    if (combineAmountOfFields < 1) combineAmountOfFields = 1;
    let dataWidthRemainder = dataWidth%combineAmountOfFields;
    dataWidth = Math.floor(dataWidth/combineAmountOfFields)*combineAmountOfFields;
    dataHeight = Math.floor(dataHeight/combineAmountOfFields)*combineAmountOfFields;

    let newValues:number[][] = [];



    return newValues;
  }

  public reduceIntensity(combineAmountOfFields:number, data:number[], dataWidth:number, dataHeight:number):number[] {
    if (combineAmountOfFields < 1) combineAmountOfFields = 1;
    let dataWidthRemainder = dataWidth%combineAmountOfFields;
    dataWidth = Math.floor(dataWidth/combineAmountOfFields)*combineAmountOfFields;
    dataHeight = Math.floor(dataHeight/combineAmountOfFields)*combineAmountOfFields;

    let rowsSplit:number[][]
    for (let i = 0; i < dataHeight; i++) {

    }

    let newValues:number[] = [];



    return newValues;
  }
}
