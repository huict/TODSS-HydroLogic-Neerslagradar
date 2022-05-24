import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
// import { Label } from 'ng2-charts';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {

  constructor() {
  }

  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true
  };
  barChartLabels: string[] = ['juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataset[] = [
    {
      data: [45, 37, 60, 70, 46, 33],
      label: 'Hoeveelheid neerslag in mm'
    }
  ];


}
