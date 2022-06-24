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

    {
      let combineContainer = document.createElement("div");
      combineContainer.style.display = "flex";
      {
        let combineLabel = document.createElement("label");
        combineLabel.style.flexGrow = "2";
        combineLabel.innerText = "Pyramiding: ";
        combineLabel.title = "De hoeveelheid cellen die samengevoegd worden";
        combineContainer.appendChild(combineLabel);
      }
      {
        let combineInput = document.createElement("input");
        combineInput.type = "number";
        combineInput.min = "1";
        combineInput.max = "6";
        combineInput.value = this._coordinatesFilter.dataCompression.toString();
        // @ts-ignore
        combineInput.addEventListener("input", e => this._map.dataCompression = e.target.value);
        combineContainer.appendChild(combineInput);
      }
      container.appendChild(combineContainer);
    }

    {
      let mapTypeContainer = document.createElement("div");
      mapTypeContainer.style.display = "flex";
      {
        let mapTypeLabel = document.createElement("label");
        mapTypeLabel.style.flexGrow = "2";
        mapTypeLabel.innerText = "Map type: ";
        mapTypeLabel.title = "De type projectie van de map";
        mapTypeContainer.appendChild(mapTypeLabel);
      }
      {
        let mapTypeCombo = document.createElement("select");
        // @ts-ignore
        mapTypeCombo.addEventListener("change", e => this._map.mapType = e.target.value);
        {
          let optionOpenStreetBW = document.createElement("option");
          optionOpenStreetBW.selected = true;
          optionOpenStreetBW.value = "OpenStreetBW"
          optionOpenStreetBW.innerText = "OpenStreetMap zwart/wit"
          mapTypeCombo.appendChild(optionOpenStreetBW);

          let optionOpenStreetColor = document.createElement("option");
          optionOpenStreetColor.value = "OpenStreetColor"
          optionOpenStreetColor.innerText = "OpenStreetMap color"
          mapTypeCombo.appendChild(optionOpenStreetColor);

          let optionStadia = document.createElement("option");
          optionStadia.value = "Stadia"
          optionStadia.innerText = "Stadia maps"
          mapTypeCombo.appendChild(optionStadia);
        }
        mapTypeContainer.appendChild(mapTypeCombo);
      }
      container.appendChild(mapTypeContainer);
    }

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
