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



@NgModule({
  declarations: [
    NavbarComponent,
    TopbarComponent,
    SalesChartComponent,
    FormProductComponent
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
    FormProductComponent
  ]
})
export class ComponentsModule { }
