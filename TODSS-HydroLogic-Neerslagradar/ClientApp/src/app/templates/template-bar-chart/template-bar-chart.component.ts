import {Component, Input, OnInit} from "@angular/core";
import {ICoordinateFilter, IMoveTimeStep, ITimeFilter, IWeatherTemplate} from "../i-weather.template";
import {AnimationMapComponent} from "../../components/animation-map/animation-map.component";

@Component({
  selector: 'app-template-bar-chart',
  templateUrl: './template-bar-chart.component.html',
  styleUrls: ['./template-bar-chart.component.css']
})

export class TemplateBarChartComponent implements OnInit, IWeatherTemplate {
  private _coordinatesFilter: ICoordinateFilter = {
    dataCompression: 3,
    pixels: [],
  };
  private _timeFilter: ITimeFilter = {
    beginTimestamp:1623974400000,
    stepSize:1,
    endTimestamp:1624060200000,
  };
  private _currentTime: IMoveTimeStep | undefined;
  private _map: AnimationMapComponent | undefined;
  private _mapDataTemp: object | undefined;

  constructor() {}

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
    let container = document.createElement("div");
    return container;
  }

  get coordinatesFilter(): ICoordinateFilter {
    return this._coordinatesFilter;
  }

  @Input() set coordinatesFilter(value: ICoordinateFilter) {
    this._coordinatesFilter = value;
  }

  handleCoordEvent(e: ICoordinateFilter) {
    this._coordinatesFilter = e;
  }

  get timeFilter(): ITimeFilter {
    return this._timeFilter;
  }

  @Input() set timeFilter(value: ITimeFilter) {
    this._timeFilter = value;
  }

  handleTimeEvent(e: ITimeFilter) {
    this._timeFilter = e;
  }

  get currentTime(): IMoveTimeStep | undefined {
    return this._currentTime;
  }

  set currentTime(value: IMoveTimeStep | undefined) {
    this._currentTime = value;
  }

  handleCurrentTimeEvent(e: IMoveTimeStep) {
    this._currentTime = e;
  }

  handleMapReadyEvent(e: AnimationMapComponent) {
    this._map = e;
  }
}
