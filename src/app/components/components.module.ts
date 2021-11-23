import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';

import { ChartsModule } from 'ng2-charts';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TopbarComponent } from './topbar/topbar.component';
import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { RouterModule } from '@angular/router';
import { FormProductComponent } from './form-product/form-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal/modal.component';
import { ReportStockComponent } from './report-stock/report-stock.component';
import { ReportSalesComponent } from './report-sales/report-sales.component';
import { CigarettesComponent } from './cigarettes/cigarettes.component';



@NgModule({
  declarations: [
    NavbarComponent,
    TopbarComponent,
    SalesChartComponent,
    FormProductComponent,
    ModalComponent,
    ReportStockComponent,
    ReportSalesComponent,
    CigarettesComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ChartsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NavbarComponent,
    TopbarComponent,
    SalesChartComponent,
    FormProductComponent,
    ModalComponent,
    ReportStockComponent,
    ReportSalesComponent,
    CigarettesComponent
  ]
})
export class ComponentsModule { }
