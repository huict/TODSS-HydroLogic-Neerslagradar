import {ICoordinateFilter, IMoveTimeStep, ITimeFilter} from "../templates/i-weather.template";
import { EventEmitter } from "@angular/core";

/**
 * Interface for a component that changes the time filters.<br>
 * Use the below line:<br>
 * @Output() changeTimeFilterEvent = new EventEmitter<ITimeFilter>();
 */
export interface IChangesTime {
  changeTimeFilterEvent: EventEmitter<ITimeFilter>;
  changeCurrentTimeEvent: EventEmitter<IMoveTimeStep>;
}

/**
 * Interface for a component that changes the coordinates filters.<br>
 * Use the below line:<br>
 * @Output() changeLocationFilterEvent = new EventEmitter<ICoordinateFilter>();
 */
export interface IChangesCoords {
  changeLocationFilterEvent: EventEmitter<ICoordinateFilter>;
}
