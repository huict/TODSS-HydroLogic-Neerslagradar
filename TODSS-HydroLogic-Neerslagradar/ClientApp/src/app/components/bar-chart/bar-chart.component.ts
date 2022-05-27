import {Component, Input} from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import {ICoordinateFilter, ITimeFilter} from "../../templates/i-weather.template";
// import { Label } from 'ng2-charts';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {
  private _coordinatesFilter: ICoordinateFilter | undefined;
  private _timeFilter: ITimeFilter | undefined;

  constructor() {
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
      data: [4.5, 3.7, 6.0, 7.0, 4.6, 3.3],
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
