import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'animation-map',
  templateUrl: './animation-map.component.html',
  styleUrls: ['./animation-map.component.css']
})
export class AnimationMapComponent implements OnInit {
  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
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

  constructor(private http: HttpClient) {
  }

  onReady(e: any) {
    this._map = e;
    // @ts-ignore
    this._map.on("click", e => {
      // @ts-ignore
      L.popup().setLatLng(e.latlng).setContent("Point set").openOn(this._map);
      // @ts-ignore
      this.addPoint(e.latlng);
    });
  }

  ngOnInit(): void {

  }

  addPoint(o: L.LatLng) {
    this._points.push(o);
    if (this._points.length == 3) this._points.shift();
    if (this._points.length == 2) {
      let top, bottom, left, right;
      let point1 = this._points[0];
      let point2 = this._points[1];

      if (point1.lat > point2.lat) {
        top = point1.lat;
        bottom = point2.lat;
      } else {
        top = point2.lat;
        bottom = point1.lat;
      }
      if (point1.lng > point2.lng) {
        left = point2.lng;
        right = point1.lng;
      } else {
        left = point1.lng;
        right = point2.lng;
      }

      if (this._mySelection) this._mySelection.remove()
      let bounds = L.latLngBounds([[ top, left], [ bottom, right]]);
      this._mySelection = L.rectangle(bounds, {fillOpacity: 0}).addTo(this.map);
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
