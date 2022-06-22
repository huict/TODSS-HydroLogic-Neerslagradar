import { ITemplate } from "./i-template.view";
import {ISelectedPixelsPersistence} from "../components/animation-map/animation-map.component";

/**
 * An interface for templates with weather data inside it.
 */
export interface IWeatherTemplate extends ITemplate {
  get coordinatesFilter():ICoordinateFilter | undefined;
  get timeFilter():ITimeFilter | undefined;
  get currentTime():IMoveTimeStep | undefined;
}

/**
 * The interface for coordinate filtering.
 */
export interface ICoordinateFilter {
  pixels: ISelectedPixelsPersistence[],
  dataCompression: number,
}

/**
 * The interface for time filtering.
 */
export interface ITimeFilter {
  stepSize: number;
  beginTimestamp: number;
  endTimestamp: number;
}

export interface IMoveTimeStep {
  currentTimestamp: number;
}
