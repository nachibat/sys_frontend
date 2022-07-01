import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ToastrService } from 'ngx-toastr';
import { Sale } from 'src/app/interfaces/sales.response';
import { SaleService } from 'src/app/services/sale.service';

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.css']
})
export class SalesChartComponent implements OnInit {

  private data: number[] = [];
  private sales: any;

  public lineChartData: ChartDataSets[] = [
    { data: this.data, label: 'Ventas Mensuales' }
  ];

  public lineChartLabels: Label[] = [];
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

  public loading: boolean = false;

  constructor(private saleService: SaleService) { }

  ngOnInit(): void {
    this.listMonth();
    this.listEarnings();
  }

  listMonth(): void {
    const today = new Date();
    const from = today.getMonth() - 5;
    const to = from + 5;
    const month: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    for (let i = from; i <= to; i++) {
      if (i < 0) {
        this.lineChartLabels.push(month[i + 12]);
      } else {
        this.lineChartLabels.push(month[i]);
      }
    }
  }

  async listEarnings() {
    this.loading = true;
    const today = new Date();
    const from = today.getMonth() - 5;
    const to = from + 5;
    let months = [];
    for (let i = from; i <= to; i++) {
      if (i < 0) {
        months.push(i + 12);
      } else {
        months.push(i);
      }
    }
    let lastyear = false;
    let thisyear = false;
    for (let i = 0; i < months.length; i++) {
      const element = months[i];
      let dateFrom;
      let dateTo;
      if (!thisyear) {
        if (months[0] >= 7 && months[0] <= 11) {
          lastyear = true;
        } else {
          lastyear = false;
        }
      }
      if (element === 0) {
        lastyear = false;
        thisyear = true;
      }
      if (lastyear) {
        dateFrom = new Date(today.getFullYear() - 1, element, 1).toISOString().slice(0, 10);
        dateTo = new Date(today.getFullYear() - 1, element + 1, 0).toISOString().slice(0, 10);
      } else {
        dateFrom = new Date(today.getFullYear(), element, 1).toISOString().slice(0, 10);
        dateTo = new Date(today.getFullYear(), element + 1, 0).toISOString().slice(0, 10);
      }
      let total: number = 0;
      this.sales = await this.saleService.saleListRange(dateFrom, dateTo);
      for (let i = 0; i < this.sales.listSales.length; i++) {
        const element = this.sales.listSales[i];
        total += element.total;
      }
      this.data.push(total);
    }
    this.loading = false;
    this.lineChartData = [
      { data: this.data, label: 'Ventas Mensuales' }
    ]
  }

}
