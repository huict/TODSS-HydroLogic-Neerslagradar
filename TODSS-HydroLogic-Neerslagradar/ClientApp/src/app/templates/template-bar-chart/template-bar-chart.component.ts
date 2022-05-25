import {Component, Input, OnInit} from "@angular/core";
import {ICoordinateFilter, IMoveTimeStep, ITimeFilter, IWeatherTemplate} from "../i-weather.template";
import {AnimationMapComponent} from "../../components/animation-map/animation-map.component";

@Component({
  selector: 'app-template-bar-chart',
  templateUrl: './template-bar-chart.component.html',
  styleUrls: ['./template-bar-chart.component.css']
})

export class TemplateBarChartComponent implements OnInit, IWeatherTemplate {
private _coordinatesFilter: ICoordinateFilter | undefined;
private _timeFilter: ITimeFilter | undefined;
private _currentTime: IMoveTimeStep | undefined;
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
    let container = document.createElement("div");
    let input = document.createElement("input");
    input.type = "number"
    // @ts-ignore
    input.value = this._map?.map.getZoom();
    // @ts-ignore
    input.addEventListener("input", e=>this._map?.map.setZoom(e.target.value))

    // TODO deze test voor template dependent settings verwijderen.
    container.appendChild(input);
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

  get moveTimeStep(): IMoveTimeStep | undefined {
    return this._currentTime;
  }

  set currentTime(value: IMoveTimeStep | undefined) {
    this._currentTime = value;
  }

  handleMapReadyEvent(e: AnimationMapComponent) {
    this._map = e;
  }
}
