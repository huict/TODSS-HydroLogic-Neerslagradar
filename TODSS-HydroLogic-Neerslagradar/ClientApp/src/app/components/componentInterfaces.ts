import { ICoordinateFilter, ITimeFilter } from "../templates/i-weather.template";
import { EventEmitter } from "@angular/core";

// @Output() changeTimeFilterEvent = new EventEmitter<ITimeFilter>();
export interface IChangesTime {
  changeTimeFilterEvent: EventEmitter<ITimeFilter>;
}

// @Output() changeLocationFilterEvent = new EventEmitter<ICoordinateFilter>();
export interface IChangesCoords {
  changeLocationFilterEvent: EventEmitter<ICoordinateFilter>;
}
