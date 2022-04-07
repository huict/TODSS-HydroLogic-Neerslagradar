import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { IChangesCoords, IChangesTime } from "../ComponentInterfaces";
import { ICoordinateFilter, ITimeFilter } from "../../templates/i-weather.template";
import {LatLng} from "leaflet";

@Component({
  selector: 'animation-map',
  templateUrl: './animation-map.component.html',
  styleUrls: ['./animation-map.component.css']
})
export class AnimationMapComponent implements IChangesCoords, IChangesTime, OnDestroy {
  @Output() changeTimeFilterEvent = new EventEmitter<ITimeFilter>();
  @Output() changeLocationFilterEvent = new EventEmitter<ICoordinateFilter>();
  @Output() mapReadyEvent = new EventEmitter<AnimationMapComponent>();
  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 18,
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      )
    ],
    zoom: 7,
    center: L.latLng(52.1009274, 5.6462977)
  };
  private _map: L.Map | undefined;
  private _mySelection: L.Polygon | undefined;
  private _points: L.LatLng[] = [];
  private _dataTemp: object | undefined;

  get data():IMapData {
    return <IMapData>{
      points: this._points,
      zoom: this._map?.getZoom(),
      centerLocation: this._map?.getCenter(),
    }
  }

  @Input() set data(value: IMapData) {
    if (value) {
      this._dataTemp = value;
      this._points = value.points;
    }
  }

  constructor(private http: HttpClient) {
  }

  ngOnDestroy(): void {
    this.changeLocationFilterEvent.unsubscribe();
    this.changeTimeFilterEvent.unsubscribe();
    this.mapReadyEvent.unsubscribe();
  }

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
    this.mapReadyEvent.emit(this);
  }

  addPoint(newPoint: L.LatLng) {
    this._points.push(newPoint);
    if (this._points.length == 3) this._points.shift();
    if (this._points.length == 2) {
      this.renderSelection();
    }
  }

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
      this._mySelection = L.rectangle(bounds, {fillOpacity: 0}).addTo(this.map);

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
}
