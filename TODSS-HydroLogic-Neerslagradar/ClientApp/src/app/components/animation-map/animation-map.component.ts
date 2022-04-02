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
    center: L.latLng(52.370216, 4.895168)
  };

  constructor() { }

  ngOnInit(): void {

  }

}
