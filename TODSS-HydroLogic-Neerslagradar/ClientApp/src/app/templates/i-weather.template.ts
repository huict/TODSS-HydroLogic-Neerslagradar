import { ITemplate } from "./i-template.view";
import { LatLng } from 'leaflet';

/**
 * An interface for templates with weather data inside it.
 */
export interface IWeatherTemplate extends ITemplate {
  get coordinatesFilter():ICoordinateFilter | undefined;
  get timeFilter():ITimeFilter | undefined;
  get moveTimeStep():IMoveTimeStep | undefined;
}

/**
 * The interface for coordinate filtering.
 */
export interface ICoordinateFilter {
  topLeft: LatLng;
  bottomRight: LatLng;
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
