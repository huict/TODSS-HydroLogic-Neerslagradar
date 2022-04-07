import { Component, Input, OnInit } from '@angular/core';
import { ICoordinateFilter, ITimeFilter, IWeatherTemplate } from "../i-weather.template";

@Component({
  selector: 'template-full-map',
  templateUrl: './template-full-map.component.html',
  styleUrls: ['./template-full-map.component.css']
})
export class TemplateFullMapComponent implements OnInit, IWeatherTemplate {
  private _coordinatesFilter: ICoordinateFilter | undefined;
  private _timeFilter: ITimeFilter | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  get data(): any {
    return {}
  }

  set data(value: any) {

  }

  get coordinatesFilter(): ICoordinateFilter | undefined {
    return this._coordinatesFilter;
  }

  @Input() set coordinatesFilter(value: ICoordinateFilter | undefined) {
    this._coordinatesFilter = value;
  }

  get timeFilter(): ITimeFilter | undefined {
    return this._timeFilter;
  }

  @Input() set timeFilter(value: ITimeFilter | undefined) {
    this._timeFilter = value;
  }
}
