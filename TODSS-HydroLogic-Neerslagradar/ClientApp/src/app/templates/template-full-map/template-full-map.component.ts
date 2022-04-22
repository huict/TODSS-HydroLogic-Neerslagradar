import {Component, Input, OnInit} from '@angular/core';
import {ICoordinateFilter, ITimeFilter, IWeatherTemplate} from "../i-weather.template";
import {AnimationMapComponent} from "../../components/animation-map/animation-map.component";

/**
 * This template is for a full screen map.
 */
@Component({
  selector: 'template-full-map',
  templateUrl: './template-full-map.component.html',
  styleUrls: ['./template-full-map.component.css']
})
export class TemplateFullMapComponent implements OnInit, IWeatherTemplate {
  private _coordinatesFilter: ICoordinateFilter | undefined;
  private _timeFilter: ITimeFilter | undefined;
  private _map: AnimationMapComponent | undefined;
  private _mapDataTemp: object | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  get data(): any {
    return {
      map:this._map?.data,
      coordinatesFilter: this.coordinatesFilter,
      timeFilter: this.timeFilter,
    }
  }

  get dataTemp(): any {
    return this._mapDataTemp;
  }

  set data(value: any) {
    this._mapDataTemp = value.map;
    this.coordinatesFilter = value.coordinatesFilter;
    this.timeFilter = value.timeFilter;
  }

  get settings(): HTMLElement {
    // TODO settings voor template toevoegen
    let container = document.createElement("div")
    container.innerText = "hallooo"

    return container;
  }

  get coordinatesFilter(): ICoordinateFilter | undefined {
    return this._coordinatesFilter;
  }

  @Input() set coordinatesFilter(value: ICoordinateFilter | undefined) {
    this._coordinatesFilter = value;
  }

  handleCoordEvent(e: ICoordinateFilter) {
    this._coordinatesFilter = e;
  }

  get timeFilter(): ITimeFilter | undefined {
    return this._timeFilter;
  }

  @Input() set timeFilter(value: ITimeFilter | undefined) {
    this._timeFilter = value;
  }

  handleTimeEvent(e: ITimeFilter) {
    this._timeFilter = e;
  }

  handleMapReadyEvent(e: AnimationMapComponent) {
    this._map = e;
  }
}
