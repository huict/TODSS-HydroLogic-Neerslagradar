import {Component, Input} from '@angular/core';
import {ChartOptions, ChartType, ChartDataset} from 'chart.js';
import {ICoordinateFilter, ITimeFilter} from "../../templates/i-weather.template";
import {HttpClient} from "@angular/common/http";

/**
 * A bar-chart that shows the average intensity of all the selected pixels and on every timeframe of the selected time period.
 */
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {
  private _coordinatesFilter: ICoordinateFilter | undefined;
  private _timeFilter: ITimeFilter | undefined;

  barChartOptions: ChartOptions = {
    responsive: false,
    maintainAspectRatio: false,
    backgroundColor: '#eb1416',
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataset[] = [];

  constructor(private http: HttpClient) {}

  // Update all the values of the graph
  private updateGraph() {
    let cf = this._coordinatesFilter;
    if (cf == undefined) return;
    if (cf.pixels.length === 0) return;
    let begin:number = <number>this._timeFilter?.beginTimestamp;
    let end:number = <number>this._timeFilter?.endTimestamp;
    let body = {
      "ids": cf.pixels.map(v => v.id),
      "StartSeconds":begin,
      "EndSeconds":end,
      "PyramidingAmount":cf.dataCompression
    };

    this.http.post("https://localhost:7187/graph", body, {headers: {"Content-Type": "application/json"}}).subscribe(e => {
      let data = e as RequestData[];

      // @ts-ignore
      this.barChartLabels = data.map((_, index) => this._getDateLabelFromIndex(index));
      this.barChartData.pop();
      this.barChartData.push({label:"Gemiddelde hoeveelheid neerslag in mm", data: data.map(v => v.average)});
    })
  }

  // Generate a label for a slice of data
  private _getDateLabelFromIndex(i: number):string {
    let add0Func = (number:number) => {
      let strnum: string = String(number)
      return strnum.length == 1 ? "0" + strnum : strnum
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
  cumulative: number;
  average: number;
}
