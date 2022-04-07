import { ITemplate } from "./i-template.view";
import { LatLng } from 'leaflet';

export interface IWeatherTemplate extends ITemplate {
  get coordinatesFilter():ICoordinateFilter | undefined;
  get timeFilter():ITimeFilter | undefined;
}

export interface ICoordinateFilter {
  topLeft: LatLng;
  bottomRight: LatLng;
}

export interface ITimeFilter {
  stepSize: number;
  beginTimestamp: number;
  endTimestamp: number;
}
