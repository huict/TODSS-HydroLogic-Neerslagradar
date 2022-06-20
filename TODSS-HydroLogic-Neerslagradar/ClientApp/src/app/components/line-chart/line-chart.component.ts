import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, Point } from "chart.js";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild('chart')
  private chartRef!: ElementRef;
  private chart!: Chart;
  private readonly data: Point[];

  constructor() {
    this.data = [{x: 1, y: 5}, {x: 2, y: 10}, {x: 3, y: 6}, {x: 4, y: 2}, {x: 4.1, y: 6}];
  }

  ngAfterViewInit() {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Interesting Data',
          data: this.data,
          fill: true,
          pointBackgroundColor: '#073B4C',
          backgroundColor: 'rgba(17, 138, 178, .5)',
          borderColor: '#073B4C',
          pointHoverBorderColor: '#118AB2',
          pointHoverBackgroundColor: '#118AB2',
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxis: {
            type: 'linear'
          },
        }
      }
    });

    this.chart.update();
  }
}
