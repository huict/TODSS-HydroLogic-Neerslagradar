import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'animation-map',
  templateUrl: './animation-map.component.html',
  styleUrls: ['./animation-map.component.css']
})
export class AnimationMapComponent implements OnInit {
  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
    ],
    zoom: 7,
    center: L.latLng(52.1009274, 5.6462977)
  };
  private _map: L.Map | undefined;
  private _mySelection: L.Polygon | undefined;
  private _points: L.LatLng[] = [];

  constructor() {
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
      this._mySelection = L.polygon([
        [top, left],
        [top, right],
        [bottom, right],
        [bottom, left]
        // @ts-ignore
      ], {fillOpacity: 0}).addTo(this._map);
    }
  }

  get map(): L.Map {
    return <L.Map>this._map;
  }
}
