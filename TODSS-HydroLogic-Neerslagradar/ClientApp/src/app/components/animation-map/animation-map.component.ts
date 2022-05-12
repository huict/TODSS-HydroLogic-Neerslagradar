import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { IChangesCoords, IChangesTime } from "../ComponentInterfaces";
import { ICoordinateFilter, ITimeFilter } from "../../templates/i-weather.template";
import {GeoJSON, LatLng} from "leaflet";
import * as gj from "geojson";
import {DataStreamReducer} from "./data-stream-reducer";

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
  selector: 'animation-map',
  templateUrl: './animation-map.component.html',
  styleUrls: ['./animation-map.component.css']
})
export class AnimationMapComponent implements IChangesCoords, IChangesTime, OnDestroy {
  @Output() changeTimeFilterEvent = new EventEmitter<ITimeFilter>();
  @Output() changeLocationFilterEvent = new EventEmitter<ICoordinateFilter>();
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
  private _map: L.Map | undefined;
  private _mySelection: L.Rectangle | undefined;
  private _points: L.LatLng[] = [];
  private _dataTemp: object | undefined;

  public _beginTime: Date = new Date(1623974400000);
  public _endTime: Date = new Date(1624060500000);

  private _animationInterval: number | undefined;
  private _animationFrames: number[][] = [];
  private _animationCoords: number[][] = [];
  private _currentFrame: number = -1;
  private _totalFrames: number = 0;
  private _lastGeoJson: GeoJSON | undefined;

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

  constructor(private http: HttpClient, private dataReducer: DataStreamReducer) {
  }

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
    this.startNewAnimation();

    // TODO remove, this was for testing styling
    let geo: gj.FeatureCollection = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {
            "fill": "#111111",
            "fill-opacity": 0.5,
            "stroke": "#8f8f8f",
            "stroke-opacity": 0,
            "stroke-width": 0
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  6.263580322265624,
                  52.342051636387865
                ],
                [
                  6.156463623046875,
                  52.283282143126186
                ],
                [
                  6.29241943359375,
                  52.20424032262008
                ],
                [
                  6.455841064453125,
                  52.237051359522724
                ],
                [
                  6.4105224609375,
                  52.3261076319194
                ],
                [
                  6.263580322265624,
                  52.342051636387865
                ]
              ]
            ]
          }
        }
      ]
    }
    new L.GeoJSON(geo).addTo(this.map);

    // Event is thrown when the map is ready
    this.mapReadyEvent.emit(this);
  }

  // Throws a time filter changed event
  changeTime(e: any, type: string) {
    let time = e.target.valueAsNumber;
    if (type == "begin") this._beginTime = new Date(time);
    if (type == "end") this._endTime = new Date(time);
    this.changeTimeFilterEvent.emit({
      stepSize:1,
      beginTimestamp: this._beginTime.valueOf(),
      endTimestamp: this._endTime.valueOf()
    })
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

  get map(): L.Map {
    return <L.Map>this._map;
  }

  public startNewAnimation() {
    this.clearAnimation();

    // TODO werkend maken over meerdere dagen.
    let calculateSeconds = (date: Date) => {
      let s:number = date.getUTCHours()*3600 + date.getUTCMinutes()*60;
      return Math.round(s/300)*300;
    }

    let beginSeconds:number = calculateSeconds(this._beginTime);
    let endSeconds:number = calculateSeconds(this._endTime);
    let totalFrames = endSeconds/300-beginSeconds/300+1;

    console.log({beginSeconds, endSeconds, totalFrames})

    this._totalFrames = totalFrames;
    this.resumeAnimation();
  }

  public clearAnimation() {
    if (this._animationInterval != undefined) clearInterval(this._animationInterval);
    if (this._lastGeoJson) this._lastGeoJson.remove();
    this._totalFrames = 0;
    this._currentFrame = -1;
    this._animationFrames = [];
  }

  public pauseAnimation() {
    if (this._animationInterval != undefined) clearInterval(this._animationInterval);
  }

  public resumeAnimation() {
    if (this._animationInterval != undefined) clearInterval(this._animationInterval);

    this.nextFrame();
    this._animationInterval = setInterval(() => this.nextFrame(), 5000);
  }

  // Checks what to do with the next frame. Load it form memory or fetch from server
  private nextFrame() {
    this._currentFrame++;
    if (this._currentFrame == this._totalFrames) this._currentFrame = 0;

    // if frame is not yet requested -> request frame
    let frameNotYetRequested = this._animationFrames.length==this._currentFrame;
    if (frameNotYetRequested) {
      this.fetchFrame();
    } else {
      this.loadFrame();
    }
  }

  // Loads the next frame from memory
  private loadFrame() {
    let geojson: gj.FeatureCollection = {
      type: "FeatureCollection",
      features: this._animationFrames[this._currentFrame].map((value, index):gj.Feature => {
        return {
          type: "Feature",
          "properties": {
            "fill": "#111111",
            "fill-opacity": 0.5,
            "stroke": "#8f8f8f",
            "stroke-opacity": 0,
            "stroke-width": 0
          },
          geometry: {
            type: "Polygon",
            coordinates: this._animationCoords[index] as unknown as gj.Position[][]
          },
        }
      }),
    }
    this._lastGeoJson?.remove();
    this._lastGeoJson = new L.GeoJSON(geojson).addTo(this.map);
  }

  // Fetches the next frame from the server, loads it into memory and loads the next frame.
  private fetchFrame() {
    // TODO fix time
    this.http.post("https://localhost:7187/radarimage", `{
       "Longitude": 2.358578,
       "Latitude": 50.25574,
       "StartSeconds" : ${this._currentFrame*300},
       "EndSeconds" : ${this._currentFrame*300+300}}`,
      {headers: {"Content-Type": "application/json"}}).subscribe(e => {
      let requestData = e as IRequestData[][];

      // If the coords are not yet saved, save them. For memory performance the coords of the polygons are only saved once.
      if (this._animationCoords.length != requestData[0].length) {
        this._animationCoords = requestData[0].map(data => data.coords);
      }

      this._animationFrames.push(requestData[0].map(data => data.intensity));
      this.loadFrame();
    })
  }
}

export interface IMapData {
  points: LatLng[],
  zoom: number,
  centerLocation: LatLng,
  beginTime: number,
  endTime:number,
}

export interface IRequestData {
  coords: [][][number],
  intensity: number
}
