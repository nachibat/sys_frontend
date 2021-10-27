import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';

import { ChartsModule } from 'ng2-charts';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TopbarComponent } from './topbar/topbar.component';
import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NavbarComponent,
    TopbarComponent,
    SalesChartComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ChartsModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    TopbarComponent,
    SalesChartComponent
  ]
})
export class ComponentsModule { }
