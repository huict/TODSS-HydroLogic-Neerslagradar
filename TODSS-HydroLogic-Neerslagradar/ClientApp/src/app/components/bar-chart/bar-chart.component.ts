import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import {ICoordinateFilter, ITimeFilter} from "../../templates/i-weather.template";
import {HttpClient} from "@angular/common/http";

// import { Label } from 'ng2-charts';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  private _coordinatesFilter: ICoordinateFilter | undefined;
  private _timeFilter: ITimeFilter | undefined;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.updateGraph();
  }

  @ViewChild("chart", {static: true}) chart!: ElementRef;

  private updateGraph() {
    this.http.post("https://localhost:7187/radarimage/intensity", `{
      "TopLeftLongitude":3.96395,
      "TopLeftLatitude":52.98227,
      "TopRightLongitude":4.13571,
      "TopRightLatitude":52.97493,
      "BotRightLongitude":4.12333,
      "BotRightLatitude":52.87131,
      "BotLeftLongitude":3.95208,
      "BotLeftLatitude":52.87862,
      "StartSeconds":0,
      "EndSeconds":8000,
      "CombineFields":1
    }`, {headers: {"Content-Type": "application/json"}}).subscribe(e => {
      let data = e as RequestData[][];
      let processData = data.map(val => {
        return val.reduce((total, intens) => intens.intensity, 0);
      })
      this.chart.nativeElement.barChartData = [{ data: processData}];
    })
  }


  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
  barChartLabels: string[] = ['10:15', '10:30', '10:45', '11:00', '11:15', '11:30'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Hoeveelheid neerslag in mm'
    }
  ];


  @Input() set coordinatesFilter(value: ICoordinateFilter | undefined) {
    console.log(value)

    this._coordinatesFilter = value;
  }

  @Input() set timeFilter(value: ITimeFilter | undefined) {
    console.log("time: " + value);
    this._timeFilter = value;
  }

}

interface RequestData {
  id: number;
  intensity: number;
}
