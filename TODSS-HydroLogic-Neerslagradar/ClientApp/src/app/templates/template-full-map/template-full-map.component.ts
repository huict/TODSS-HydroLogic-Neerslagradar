import {Component, Input, OnInit} from '@angular/core';
import {ICoordinateFilter, ITimeFilter, IWeatherTemplate} from "../i-weather.template";

@Component({
  selector: 'template-full-map',
  templateUrl: './template-full-map.component.html',
  styleUrls: ['./template-full-map.component.css']
})
export class TemplateFullMapComponent implements OnInit, IWeatherTemplate {
  private _coordinatesFilter: ICoordinateFilter | undefined;
  private _timeFilter: ITimeFilter | undefined;
  private _data: object | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  get data(): any {
    return this._data
  }

  set data(value: any) {
    this._data = value;
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
}
