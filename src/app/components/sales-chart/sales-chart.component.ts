import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.css']
})
export class SalesChartComponent implements OnInit {

  lineChartData: ChartDataSets[] = [
    { data: [40000, 39500, 41000, 40000, 39300, 42000, 43000], label: 'Ventas Mensuales' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Tortillas' },
    // { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Chorizos' }
  ];

  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  public lineChartOptions: ChartOptions = {
    responsive: true
  }

  public lineChartColors: Color[] = [
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartType: ChartType = 'line';

  constructor() { }

  ngOnInit(): void {
  }

}
