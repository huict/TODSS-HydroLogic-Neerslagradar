import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as L from 'leaflet';
import {IChangesCoords, IChangesTime} from "../ComponentInterfaces";
import {ICoordinateFilter, IMoveTimeStep, ITimeFilter} from "../../templates/i-weather.template";
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
    layers: <L.Layer[]>[],
    zoom: 7,
    center: L.latLng(52.1009274, 5.6462977),
    doubleClickZoom: false
  };

  // map variables
  private _map: L.Map | undefined;
  private _mapLoaded: boolean = false;
  private _dataTemp: IMapData | undefined;
  private _selectedPixels: ISelectedPixels = {};
  private _initialLoadedPixels: ISelectedPixelsPersistence[] = [];
  private _lastMapLayer: L.Layer | undefined;
  private _mapType: string = "";

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
  private _lastGeoJson: L.GeoJSON | undefined;
  private _animationPlaying: boolean = false;

  // animation options
  private _animationTime: number = 750;
  private _dataCompression: number = 3;
  private _animationStepSize: number = 1;

  get map(): L.Map {
    return <L.Map>this._map;
  }

  @Input() set mapType(type: string) {
    if (this._lastMapLayer) this.map.removeLayer(this._lastMapLayer);

    switch (type) {
      case "OpenStreetColor":
        this._lastMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        });
        break;
      case "Stadia":
        this._lastMapLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
          maxZoom: 18,
        });
        break;
      case "OpenStreetBW":
      default:
        this._lastMapLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 18,
        });
        break;
    }

    this._mapType = type;
    if (this._mapLoaded) this.map.addLayer(this._lastMapLayer);
  }

  get dataCompression():number {
    return this._dataCompression;
  }

  @Input() set dataCompression(value:number) {
    if (this._dataCompression === value) return;
    this._dataCompression = value;
    this.fetchCoords();
    this.startNewAnimation();
    Object.keys(this._selectedPixels).forEach(v => this.removeSelectedPixel(parseInt(v)));
    this.changeLocationFilterEvent.emit({dataCompression: value, pixels: []});
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

  get coordinateFilter(): ICoordinateFilter {
    return {
      pixels: this.convertPolygonsToPixelJson(),
      dataCompression: this._dataCompression,
    }
  }

  @Input() set coordinateFilter(coordinateFilter: ICoordinateFilter) {
    this.dataCompression = coordinateFilter.dataCompression;
    if (this._mapLoaded) {
      Object.keys(this._selectedPixels).forEach(v => this.removeSelectedPixel(parseInt(v)));
      coordinateFilter.pixels.forEach(point => this.drawSelectPixel(point.id, point.value));
    } else {
      this._initialLoadedPixels = coordinateFilter.pixels;
    }
  }

  get timeFilter(): ITimeFilter {
    return {
      beginTimestamp: this._beginTime.valueOf(),
      endTimestamp: this._endTime.valueOf(),
      stepSize: this._animationStepSize,
    }
  }

  @Input() set timeFilter(timeFilter: ITimeFilter) {
    this._beginTime = new Date(timeFilter.beginTimestamp);
    this._endTime = new Date(timeFilter.endTimestamp);
    this._currentTime = new Date(timeFilter.beginTimestamp);
    this._animationStepSize = timeFilter.stepSize;
  }

  get currentFrameIndex(): number {
    return this._currentFrameIndex;
  }

  set currentFrameIndex(value: number) {
    this._currentFrameIndex = value;
    this._nextFrameIndex = value;
    this._currentTime = new Date(this._beginTime.valueOf()+ value*this._animationStepSize*300000);
  }

  get totalFrames(): number {
    return this._totalFrames;
  }

  get data():IMapData {
    return <IMapData>{
      zoom: this._map?.getZoom(),
      centerLocation: this._map?.getCenter(),
      mapType: this._mapType,
    }
  }

  @Input() set data(value: IMapData) {
    if (value) {
      this._dataTemp = value;
    }
  }

  private convertPolygonsToPixelJson(): ISelectedPixelsPersistence[] {
    return Object.keys(this._selectedPixels).map(value => {
      return {
        id: value,
        value: this._selectedPixels[value].getLatLngs() as L.LatLngExpression[]
      };
    });
  }

  constructor(private http: HttpClient) {
    this.mapType = "OpenStreetBW";
    if (this._lastMapLayer) this.options.layers.push(this._lastMapLayer);
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

    // add click event listener for map
    this.map.on("click", e => {
      // @ts-ignore
      let coords: L.LatLng = e.latlng;

      // pixel detection:
      let pixel = this.selectPixel(coords);
      if (pixel === null) return;
      if (!this._selectedPixels.hasOwnProperty(pixel.id)) return;

      // popup generation:
      let popup = L.popup().setLatLng(coords);

      let container = document.createElement("div");

      let removeBtn = document.createElement("button");
      removeBtn.innerText = "x"

      if (true) {
        removeBtn.style.border = "none";
        removeBtn.style.backgroundColor = "transparent";
        removeBtn.style.fontSize = "20px";
        removeBtn.style.marginBottom = "10px";
      }

      removeBtn.addEventListener("click", e => popup.remove());
      container.appendChild(removeBtn);

      let area = document.createElement("div");
      let areaKm = document.createElement("div");
      let areaBreak = document.createElement("br");
      let areaValue = Math.round(this.calculateArea([...pixel.coords[0], pixel.coords[0][0]])*100)/100;
      area.innerText = `Oppervlakte (km²): `
      area.style.fontSize = "18px";
      areaKm.innerText = areaValue.toString();
      container.appendChild(area);
      container.appendChild(areaKm);
      container.appendChild(areaBreak);


      let intensity = document.createElement("div");
      let intensityText = document.createElement("div");
      let frameCell = this._animationFrames[this.currentFrameIndex].find(v=>v.id===pixel?.id);
      let intensityValue = frameCell !== undefined ? frameCell.intensity : 0;
      intensityValue *= 12;
      intensityValue = Math.round(intensityValue*100)/100;
      intensity.innerText = `Intensiteit: `;
      intensity.style.fontSize = "18px";
      intensityText.innerText = `${intensityValue}mm/h`
      container.appendChild(intensity);
      container.appendChild(intensityText);

      popup.options.closeButton = false;
      popup.setContent(container).openOn(this.map);
      // setTimeout(() => popup.remove(), 1000);
    });
    // set initial view and start animation
    if (this._dataTemp) this.map.setView(this._dataTemp.centerLocation, this._dataTemp.zoom);
    this.fetchCoords();
    this.startNewAnimation();

    // load selection
    this._initialLoadedPixels.forEach(point => this.drawSelectPixel(point.id, point.value));

    // Event is thrown when the map is loaded
    this._mapLoaded = true;
    if (this._dataTemp) this.mapType = this._dataTemp.mapType;
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

  selectPixel(point: L.LatLng): ICoordsData|null {
    let poly = this._animationCoords.find((value) => {
      let lng = point.lng, lat = point.lat;
      let coords = value.coords[0];
      let inside = false;

      for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
        let xi = coords[i][0], yi = coords[i][1];
        let xj = coords[j][0], yj = coords[j][1];

        let intersect = ((yi > lat) != (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    })
    if (poly === undefined) return null;

    if (this._selectedPixels.hasOwnProperty(poly.id)) {
      this.removeSelectedPixel(poly.id);
    } else {
      this.drawSelectPixel(poly.id.toString(), poly.coords[0].map(value => [value[1], value[0]]) as L.LatLngExpression[])
    }
    this.changeLocationFilterEvent.emit({dataCompression: this._dataCompression, pixels: this.convertPolygonsToPixelJson()});
    return poly;
  }

  private drawSelectPixel(id: string, coords: L.LatLngExpression[]) {
    this._selectedPixels[id] = L.polygon(coords, {fillOpacity: 0, color: '#EF476F'});
    this._selectedPixels[id].addTo(this.map);
  }

  private removeSelectedPixel(id: number) {
    this._selectedPixels[id].remove();
    delete this._selectedPixels[id];
  }

  private calculateArea(poly: number[][]): number {
    let area = 0;
    for (let i = 0; i < poly.length - 1; i++)
    {
      let [p1lo, p1la] = poly[i];
      let [p2lo, p2la] = poly[i + 1];
      area += (p2lo-p1lo)*Math.PI/180 * (2+Math.sin(p1la*Math.PI/180)+Math.sin(p2la*Math.PI/180));
    }
    area = area * 6378.137 * 6378.137 / 2;
    return Math.abs(area);
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
          let intensity: number = feature?.properties["intensity"]*12;
          let boarderWeights = 0.1;
          let opacityLightColors = 0.7;
          let opacityDarkColors = 0.55;
          let color:string = "#000000"
          switch (true) {
            case intensity <= 0.02/12:
              return {
                fillOpacity: 0,
                opacity: 0,
                weight: 0
              }
            case intensity <= 1:
              color = this.getGradientColor("#9db6d6", "#4c7bb5", intensity);
              return {
                fillColor: color,
                color: color,
                weight: boarderWeights,
                fillOpacity: opacityLightColors*intensity/4*3 + opacityLightColors/4,
                opacity: opacityLightColors*intensity/4*3 + opacityLightColors/4
              }
            case intensity <= 2:
              color = this.getGradientColor("#4c7bb5", "#1e00ff", intensity-1);
              return {
                fillColor: color,
                color: color,
                weight: boarderWeights,
                fillOpacity: opacityLightColors,
                opacity: opacityLightColors
              }
            case intensity <= 5:
              color = this.getGradientColor("#1e00ff", "#e718aa", (intensity-2)/3);
              return {
                fillColor: color,
                color: color,
                weight: boarderWeights,
                fillOpacity: opacityDarkColors,
                opacity: opacityDarkColors
              }
            case intensity <= 10:
              color = this.getGradientColor("#e718aa", "#eb1416", (intensity-5)/5);
              return {
                fillColor: color,
                color: color,
                weight: boarderWeights,
                fillOpacity: opacityDarkColors,
                opacity: opacityDarkColors
              }
            case intensity <= 20:
              color = this.getGradientColor("#eb1416", "#000000", (intensity-10)/10);
              return {
                fillColor: color,
                color: color,
                weight: boarderWeights,
                fillOpacity: opacityDarkColors,
                opacity: opacityDarkColors
              }
            default:
              return {
                fillColor: color,
                color: color,
                weight: boarderWeights,
                fillOpacity: opacityDarkColors,
                opacity: opacityDarkColors
              }
          }
        }}).addTo(this.map);
      Object.values(this._selectedPixels).forEach(value => value.bringToFront());
    }

    // update current time
    this._currentFrameIndex = this._nextFrameIndex;
    this._currentTime = new Date(this._beginTime.valueOf()+ this._currentFrameIndex*this._animationStepSize*300000);
    this.changeCurrentTimeEvent.emit({
      currentTimestamp: this._currentTime.valueOf()
    })
  }

  private getGradientColor = function(start_color: string, end_color: string, percent: number): string {
    let addZero = (hex: string) => hex.length===2 ? hex : "0"+hex;

    start_color = start_color.replace("#", "");
    end_color = end_color.replace("#", "");

    // get colors
    let start_red = parseInt(start_color.substring(0, 2), 16);
    let start_green = parseInt(start_color.substring(2, 4), 16);
    let start_blue = parseInt(start_color.substring(4, 6), 16);

    let end_red = parseInt(end_color.substring(0, 2), 16);
    let end_green = parseInt(end_color.substring(2, 4), 16);
    let end_blue = parseInt(end_color.substring(4, 6), 16);

    // calculate new color
    let diff_red = end_red - start_red;
    let diff_green = end_green - start_green;
    let diff_blue = end_blue - start_blue;

    let red_hex = addZero(((diff_red * percent) + start_red ).toString(16).split('.')[0]);
    let green_hex = addZero(((diff_green * percent) + start_green ).toString(16).split('.')[0]);
    let blue_hex = addZero(((diff_blue * percent) + start_blue ).toString(16).split('.')[0]);

    return '#' + red_hex + green_hex + blue_hex;
  };

  // Fetches the coordinates for the frames
  private fetchCoords() {
    this._animationCoords = [];
    this.http.post("https://localhost:7187/radarimage/coords", `{
       "PyramidingAmount": ${this._dataCompression}}`,
      {headers: {"Content-Type": "application/json"}}).subscribe(e => {
      this._animationCoords = e as ICoordsData[];
    });
  }

  // Fetches the next frame from the server, loads it into memory and loads the next frame.
  private fetchFrame(fetchTime: number, frameIndex: number, autoLoadNext: boolean) {
    this.http.post("https://localhost:7187/radarimage/intensity", `{
       "PyramidingAmount": ${this._dataCompression},
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
  zoom: number,
  centerLocation: L.LatLng,
  mapType: string,
}

export interface IIntensityData {
  id: number,
  intensity: number
}

export interface ICoordsData {
  id: number,
  coords: number[][][]
}

export interface ISelectedPixels {
  [key: string]: L.Polygon
}

export interface ISelectedPixelsPersistence {
  id: string,
  value: L.LatLngExpression[]
}
