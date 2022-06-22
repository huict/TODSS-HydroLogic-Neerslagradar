import {Component, Input, OnInit} from '@angular/core';
import {ChartOptions, ChartType, ChartDataset} from 'chart.js';
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

  barChartOptions: ChartOptions = {
    responsive: false,
    maintainAspectRatio: false
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Hoeveelheid neerslag in mm'
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {

  }

  private updateGraph() {
    let calculateTimeFunc = (date:Date) => {
      let s:number = date.getUTCHours()*3600 + date.getUTCMinutes()*60;
      return Math.round(s/300)*300;
    }

    if (this._coordinatesFilter == undefined) return;
    let cf = this._coordinatesFilter;
    let begin:number = <number>this._timeFilter?.beginTimestamp;
    let end:number = <number>this._timeFilter?.endTimestamp;
    // TODO convert selection to points
    let body = {
      "StartSeconds":calculateTimeFunc(new Date(begin)),
      "EndSeconds":calculateTimeFunc(new Date(end)),
      "CombineFields":1
    };

    this.http.post("https://localhost:7187/radarimage/intensity", body, {headers: {"Content-Type": "application/json"}}).subscribe(e => {
      let data = e as RequestData[][];
      let processData = data.map(val => {
        let amountOfCells = val.length;
        return val.reduce((total, intens) => total+intens.intensity, 0) / amountOfCells;
      });

      // @ts-ignore
      this.barChartLabels = processData.map((_, index) => this._getDateLabelFromIndex(index));
      this.barChartData.pop();
      this.barChartData.push({
        label:"Hoeveelheid neerslag in mm",
        data: processData
      });
    })
  }

  private _getDateLabelFromIndex(i: number):string {
    let add0Func = (number:number) => {
      let strnum: string = String(number)
      if (strnum.length == 1) return "0" + strnum
      return strnum
    };
    let begin:number = <number>this._timeFilter?.beginTimestamp;
    let d = new Date(begin + i*300000);
    return `${add0Func(d.getUTCHours())}:${add0Func(d.getUTCMinutes())}`;
  }

  @Input() set coordinatesFilter(value: ICoordinateFilter | undefined) {
    this._coordinatesFilter = value;
    this.updateGraph();
  }

  @Input() set timeFilter(value: ITimeFilter) {
    this._timeFilter = value;
    this.updateGraph();
  }
}

interface RequestData {
  id: number;
  intensity: number;
}
