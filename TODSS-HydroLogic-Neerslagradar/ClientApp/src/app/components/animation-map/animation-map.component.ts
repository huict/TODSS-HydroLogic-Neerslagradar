import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { IChangesCoords, IChangesTime } from "../ComponentInterfaces";
import { ICoordinateFilter, ITimeFilter } from "../../templates/i-weather.template";
import {LatLng} from "leaflet";

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

  constructor(private http: HttpClient) {
  }

  ngOnDestroy(): void {
    this.changeLocationFilterEvent.unsubscribe();
    this.changeTimeFilterEvent.unsubscribe();
    this.mapReadyEvent.unsubscribe();
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

    // Event if thrown when the map is ready
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
      this._mySelection = L.rectangle(bounds, {fillOpacity: 0, color: 'var(--hydrologic-blue)'}).addTo(this.map);

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

  // Fetches the images for the animation.
  private fetchImage() {
    // TODO fetch image and set it to temp url

    // TODO get actual coordinates and create bound
    let bounds = L.latLngBounds([[ 55.39, 0], [ 49.36, 10.85]]);
    // TODO insert temp url of image
    L.imageOverlay("https://cdn.discordapp.com/attachments/805785211774304297/960102663096242226/1.png", bounds, {opacity: 0.8}).addTo(this.map);
  }
}

export interface IMapData {
  points: LatLng[],
  zoom: number,
  centerLocation: LatLng,
  beginTime: number,
  endTime:number,
}
