import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { IChangesCoords, IChangesTime } from "../ComponentInterfaces";
import {ICoordinateFilter, IMoveTimeStep, ITimeFilter} from "../../templates/i-weather.template";
import {GeoJSON, LatLng} from "leaflet";
import * as gj from "geojson";

/**
 * This component is a map on which filters can be set and an animation of the weather can be viewed.
 *
 * <br><h2>Filters:</h2><br>
 * The filters that this component changes are the coordinates filter and the time filter.
 * The coordinates filter can be set by making a selection on the map.
 * The time filter can be set by selecting a begin- and end time.
 *
 * <br><h2>Animation:</h2><br>
 * The map shows an animation of the weather on itself. With the time filter the timeframe of the animation can be
 * changed.
 *
 * <br><h2>Data:</h2><br>
 * The data of the map is not exact. It is used to somewhat show the intensity of the weather. Other components
 * are recommended to show a better picture of the weather data.
 */
@Component({
  selector: 'app-animation-map',
  templateUrl: './animation-map.component.html',
  styleUrls: ['./animation-map.component.css']
})
export class AnimationMapComponent implements IChangesCoords, IChangesTime, OnDestroy {
  @Output() changeTimeFilterEvent = new EventEmitter<ITimeFilter>();
  @Output() changeLocationFilterEvent = new EventEmitter<ICoordinateFilter>();
  @Output() changeCurrentTimeEvent = new EventEmitter<IMoveTimeStep>();
  @Output() mapReadyEvent = new EventEmitter<AnimationMapComponent>();

  // starting options for loading map
  options = {
    layers: [

      // Original
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      //   { maxZoom: 18,
      //     attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      //   }
      // )

      // Kadaster waterkaart
      // L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:3857/{z}/{x}/{y}.png', {
      //   minZoom: 6,
      //   maxZoom: 19,
      //   bounds: [[50.5, 3.25], [54, 7.6]],
      //   attribution: 'Kaartgegevens &copy; <a href="https://www.kadaster.nl">Kadaster</a>'
      // })

      // Less contrast 1
      // L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      //   maxZoom: 20,
      //   attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      // })

      // Less contrast 2
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }),
    ],
    zoom: 7,
    center: L.latLng(52.1009274, 5.6462977)
  };

  // map variables
  private _map: L.Map | undefined;
  private _mySelection: L.Rectangle | undefined;
  private _points: L.LatLng[] = [];
  private _dataTemp: object | undefined;

  // time filters
  public _beginTime: Date = new Date(1623974400000);
  public _currentTime: Date = new Date(this._beginTime);
  public _endTime: Date = new Date(1624060500000);

  // animation variables
  private _animationInterval: number | undefined;
  private _animationFrames: IIntensityData[][] = [];
  private _animationCoords: ICoordsData[] = [];
  private _nextFrameIndex: number = -1;
  private _currentFrameIndex: number = -1;
  private _totalFrames: number = 0;
  private _lastGeoJson: GeoJSON | undefined;
  private _animationPlaying: boolean = false;

  // animation options
  private _animationTime: number = 750;
  private _dataCompression: number = 3;
  private _animationStepSize: number = 1;

  get map(): L.Map {
    return <L.Map>this._map;
  }

  get dataCompression():number {
    return this._dataCompression;
  }

  @Input() set dataCompression(value:number) {
    this._dataCompression = value;
  }

  get animationStepSize(): number {
    return this._animationStepSize;
  }

  set animationStepSize(value: number) {
    this._animationStepSize = value;
  }

  get animationPlaying(): boolean {
    return this._animationPlaying;
  }

  set animationPlaying(value: boolean) {
    this._animationPlaying = value;
    if (value) {
      this.resumeAnimation();
    } else {
      this.pauseAnimation();
    }
  }

  get currentFrameIndex(): number {
    return this._currentFrameIndex;
  }

  set currentFrameIndex(value: number) {
    this._currentFrameIndex = value;
    this._nextFrameIndex = value;
  }

  get totalFrames(): number {
    return this._totalFrames;
  }

  get data():IMapData {
    return <IMapData>{
      points: this._points,
      zoom: this._map?.getZoom(),
      centerLocation: this._map?.getCenter(),
      beginTime: this._beginTime.valueOf(),
      endTime: this._endTime.valueOf(),
    }
  }

  @Input() set data(value: IMapData) {
    if (value) {
      this._dataTemp = value;
      this._points = value.points;
      if (value.beginTime > 0) this._beginTime = new Date(value.beginTime);
      if (value.endTime > 0) this._endTime = new Date(value.endTime);
    }
  }

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.changeLocationFilterEvent.unsubscribe();
    this.changeTimeFilterEvent.unsubscribe();
    this.mapReadyEvent.unsubscribe();
    this.clearAnimation();
  }

  // This function is run when leaflet says the map is ready
  onReady(e: any) {
    this._map = e;
    this.map.on("click", e => {
      // @ts-ignore
      let popup = L.popup().setLatLng(e.latlng).setContent("Point set").openOn(this.map);
      // @ts-ignore
      this.addPoint(e.latlng);

      setTimeout(() => popup.remove(), 1500)
    });
    // @ts-ignore
    if (this._dataTemp) this.map.setView(this._dataTemp.centerLocation, this._dataTemp.zoom);
    this.renderSelection();
    this.fetchCoords();
    this.startNewAnimation();

    // Event is thrown when the map is ready
    this.mapReadyEvent.emit(this);
  }

  // Throws a time filter changed event
  changeTime(e: any, type: string) {
    const min5 = 1000 * 60 * 5;
    let time = e.target.valueAsNumber;

    if (type == "begin") this._beginTime = new Date(Math.round(time / min5) * min5);
    if (type == "end") this._endTime = new Date(Math.round(time / min5) * min5);
    if (this._endTime.valueOf() < this._beginTime.valueOf()) this._endTime = new Date(this._beginTime.valueOf());
    this._currentTime = new Date(this._beginTime.valueOf());

    this.changeTimeFilterEvent.emit({
      stepSize:1,
      beginTimestamp: this._beginTime.valueOf(),
      endTimestamp: this._endTime.valueOf()
    });

    // TODO step size automatisch aanpassen aan tijd range
    this.startNewAnimation();
  }

  // Adds a new point to list of points and removes the first one if the list has a length of three points.
  addPoint(newPoint: L.LatLng) {
    this._points.push(newPoint);
    if (this._points.length == 3) this._points.shift();
    if (this._points.length == 2) {
      this.renderSelection();
    }
  }

  // Render the two selected points on the map as a rectangle.
  private renderSelection() {
    if (this._points.length == 2) {
      let point1 = this._points[0];
      let point2 = this._points[1];
      let lats = [point1.lat, point2.lat].sort();
      let lngs = [point1.lng, point2.lng].sort();
      let bottom = lats[0];
      let top = lats[1];
      let left = lngs[0];
      let right = lngs[1];

      if (this._mySelection) this._mySelection.remove();
      let bounds = L.latLngBounds([[ top, left], [ bottom, right]]);
      this._mySelection = L.rectangle(bounds, {fillOpacity: 0, color: '#EF476F'}).addTo(this.map);

      const location: ICoordinateFilter = {
        topLeft: new L.LatLng(top, left),
        bottomRight: new L.LatLng(bottom, right)
      };
      this.changeLocationFilterEvent.emit(location);
    }
  }

  public startNewAnimation() {
    this.clearAnimation();

    let beginSeconds:number = this._beginTime.valueOf();
    let endSeconds:number = this._endTime.valueOf();
    let totalFrames = endSeconds/300000-beginSeconds/300000+1;
    totalFrames = Math.floor(totalFrames/this._animationStepSize)

    for (let i = 0; i < totalFrames; i++) this._animationFrames.push([]);

    this._totalFrames = totalFrames;
    this.resumeAnimation();
  }

  public clearAnimation() {
    if (this._animationInterval != undefined) clearInterval(this._animationInterval);
    this._animationInterval = undefined;
    this._animationPlaying = false;
    this._lastGeoJson?.remove();
    this._totalFrames = 0;
    this._nextFrameIndex = -1;
    this._currentFrameIndex = -1;
    this._animationFrames = [];
  }

  public pauseAnimation() {
    this._animationPlaying = false;
    if (this._animationInterval != undefined) clearInterval(this._animationInterval);
  }

  public resumeAnimation() {
    this._animationPlaying = true;
    if (this._animationInterval != undefined) clearInterval(this._animationInterval);

    this.nextFrame();
    this._animationInterval = setInterval(() => this.nextFrame(), this._animationTime);
  }

  // Checks what to do with the next frame. Load it form memory or fetch from server
  private nextFrame() {
    // Is the previous frame loaded
    if (this._currentFrameIndex != this._nextFrameIndex) return;
    this._nextFrameIndex++;
    if (this._nextFrameIndex == this._totalFrames) this._nextFrameIndex = 0;

    // if frame is not yet requested -> request frame
    let frameNotYetRequested = this._animationFrames[this._nextFrameIndex].length == 0;
    if (frameNotYetRequested) {
      this.fetchFrame(this._beginTime.valueOf()+this._nextFrameIndex*this._animationStepSize*300000, this._nextFrameIndex, true);
    } else {
      this.loadFrame();
    }

    // Allso look at the next frame and load that beforehand
    let nextNextFrameIndex = this._nextFrameIndex+1;
    if (this._animationFrames[nextNextFrameIndex] && this._animationFrames[nextNextFrameIndex].length == 0) {
      this.fetchFrame(this._beginTime.valueOf()+nextNextFrameIndex*this._animationStepSize*300000, nextNextFrameIndex, false);
    }
  }

  // Loads the next frame from memory
  private loadFrame() {
    if (this._animationCoords.length != 0) {
      let geojson: gj.FeatureCollection = {
        type: "FeatureCollection",
        features: this._animationFrames[this._nextFrameIndex].map((value, index):gj.Feature => {
          return {
            type: "Feature",
            "properties": {
              "intensity":value.intensity
            },
            geometry: {
              type: "Polygon",
              coordinates: this._animationCoords[value.id].coords as unknown as gj.Position[][]
            },
          }
          // @ts-ignore
        }).filter(value => value.properties["intensity"]>0),
      }
      this._lastGeoJson?.remove();
      this._lastGeoJson = new L.GeoJSON(geojson, {interactive: false, style: feature => {
          let intensity: number = feature?.properties["intensity"];
          let boarderWeights = 0.1;
          let opacityLightColors = 0.7;
          let opacityDarkColors = 0.6;
          switch (true) {
            case intensity <= 0.02/12:
              return {
                fillOpacity: 0,
                opacity: 0,
                weight: 0
              }
            case intensity <= 1/12:
              return {
                fillColor: "#9db6d6",
                color: "#9db6d6",
                weight: boarderWeights,
                fillOpacity: opacityLightColors,
                opacity: opacityLightColors
              }
            case intensity <= 2/12:
              return {
                fillColor: "#4c7bb5",
                color: "#4c7bb5",
                weight: boarderWeights,
                fillOpacity: opacityLightColors,
                opacity: opacityLightColors
              }
            case intensity <= 5/12:
              return {
                fillColor: "#1e00ff",
                color: "#1e00ff",
                weight: boarderWeights,
                fillOpacity: opacityDarkColors,
                opacity: opacityDarkColors
              }
            case intensity <= 10/12:
              return {
                fillColor: "#eb1416",
                color: "#eb1416",
                weight: boarderWeights,
                fillOpacity: opacityDarkColors,
                opacity: opacityDarkColors
              }
            case intensity <= 20/12:
              return {
                fillColor: "#e718aa",
                color: "#e718aa",
                weight: boarderWeights,
                fillOpacity: opacityDarkColors,
                opacity: opacityDarkColors
              }
            default:
              return {
                fillColor: "#000000",
                color: "#000000",
                weight: boarderWeights,
                fillOpacity: opacityDarkColors,
                opacity: opacityDarkColors
              }
          }
        }}).addTo(this.map);
      this._mySelection?.bringToFront();
    }

    // update current time
    this._currentFrameIndex = this._nextFrameIndex;
    this._currentTime = new Date(this._beginTime.valueOf()+ this._currentFrameIndex*this._animationStepSize*300000);
    this.changeCurrentTimeEvent.emit({
      currentTimestamp: this._currentTime.valueOf()
    })
  }

  // Fetches the coordinates for the frames
  private fetchCoords() {
    this.http.post("https://localhost:7187/radarimage/coords", `{
       "CombineFields": ${this._dataCompression}}`,
      {headers: {"Content-Type": "application/json"}}).subscribe(e => {
      this._animationCoords = e as ICoordsData[];
    });
  }

  // Fetches the next frame from the server, loads it into memory and loads the next frame.
  private fetchFrame(fetchTime: number, frameIndex: number, autoLoadNext: boolean) {
    this.http.post("https://localhost:7187/radarimage/intensity", `{
       "CombineFields": ${this._dataCompression},
       "StartTimestamp" : ${fetchTime},
       "EndTimestamp" : ${fetchTime+300000}}`,
      {headers: {"Content-Type": "application/json"}}).subscribe(e => {
      let requestData = e as IIntensityData[][];
      this._animationFrames[frameIndex] = requestData[0];
      if (autoLoadNext) this.loadFrame();
    });
  }

  public add0ToNumberFront(number: number): string {
    let strnum: string = String(number)
    if (strnum.length == 1) return "0" + strnum
    return strnum
  }
}

export interface IMapData {
  points: LatLng[],
  zoom: number,
  centerLocation: LatLng,
  beginTime: number,
  endTime:number,
}

export interface IIntensityData {
  id: number,
  intensity: number
}

export interface ICoordsData {
  id: number,
  coords: number[][][]
}
