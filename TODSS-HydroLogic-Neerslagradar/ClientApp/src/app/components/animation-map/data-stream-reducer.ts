import {Injectable} from "@angular/core";

/**
 * Voor het reduceren van data die is opgehaald vanuit een request. Dit is om minder data op te slaan en te renderen.
 */
@Injectable({providedIn:"root"})
export class DataStreamReducer {
  public reduceCoords(combineAmountOfFields:number, data:number[][][][], dataHeight:number, dataWidth:number):number[][][][] {
    if (combineAmountOfFields < 1) combineAmountOfFields = 1;
    if (combineAmountOfFields == 1) return data;
    let dataWidthRemainder = dataHeight%combineAmountOfFields;
    let roundedDataHeight = Math.floor(dataHeight/combineAmountOfFields)*combineAmountOfFields;
    let roundedDataWidth = Math.floor(dataWidth/combineAmountOfFields)*combineAmountOfFields;

    let rowsSplit:number[][][][][] = [];
    for (let i = 0; i < roundedDataWidth; i++) {
      rowsSplit.push(data.slice(dataHeight*i, roundedDataHeight*(i+1)+dataWidthRemainder*i))
    }

    let newValues:number[][][][] = [];
    for (let heightBlock = 0; heightBlock < roundedDataWidth; heightBlock += combineAmountOfFields) {
      for (let widthBlock = 0; widthBlock < roundedDataHeight; widthBlock += combineAmountOfFields) {
        let blockNewCoords: number[][] = [[], [], [], []];
        for (let heightInBlock = 0; heightInBlock < combineAmountOfFields; heightInBlock++) {
          for (let widthInBlock = 0; widthInBlock < combineAmountOfFields; widthInBlock++) {
            switch (true) {
              case widthInBlock==0 && heightInBlock==combineAmountOfFields-1:
                blockNewCoords[1] = rowsSplit[heightBlock+heightInBlock][widthBlock+widthInBlock][0][1];
                break;
              case widthInBlock==combineAmountOfFields-1 && heightInBlock==combineAmountOfFields-1:
                blockNewCoords[2] = rowsSplit[heightBlock+heightInBlock][widthBlock+widthInBlock][0][2];
                break;
              case widthInBlock==combineAmountOfFields-1 && heightInBlock==0:
                blockNewCoords[3] = rowsSplit[heightBlock+heightInBlock][widthBlock+widthInBlock][0][3];
                break;
              case widthInBlock==0 && heightInBlock==0:
                blockNewCoords[0] = rowsSplit[heightBlock+heightInBlock][widthBlock+widthInBlock][0][0];
                break;
            }
          }
        }
        newValues.push([blockNewCoords]);
      }
    }
    return newValues;
  }

  public reduceIntensity(combineAmountOfFields:number, data:number[], dataHeight:number, dataWidth:number):number[] {
    if (combineAmountOfFields < 1) combineAmountOfFields = 1;
    if (combineAmountOfFields == 1) return data;
    let dataWidthRemainder = dataHeight%combineAmountOfFields;
    let roundedDataHeight = Math.floor(dataHeight/combineAmountOfFields)*combineAmountOfFields;
    let roundedDataWidth = Math.floor(dataWidth/combineAmountOfFields)*combineAmountOfFields;

    let rowsSplit:number[][] = [];
    for (let i = 0; i < roundedDataWidth; i++) {
      rowsSplit.push(data.slice(dataHeight*i, roundedDataHeight*(i+1)+dataWidthRemainder*i))
    }

    let newValues:number[] = [];
    for (let heightBlock = 0; heightBlock < roundedDataWidth; heightBlock += combineAmountOfFields) {
      for (let widthBlock = 0; widthBlock < roundedDataHeight; widthBlock += combineAmountOfFields) {
        let blockTotal = 0;
        for (let heightInBlock = 0; heightInBlock < combineAmountOfFields; heightInBlock++) {
          for (let widthInBlock = 0; widthInBlock < combineAmountOfFields; widthInBlock++) {
            blockTotal += rowsSplit[heightBlock+heightInBlock][widthBlock+widthInBlock];
          }
        }
        newValues.push(blockTotal);
      }
    }

    return newValues;
  }
}
