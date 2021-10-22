import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../components/components.module';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { SalesComponent } from './sales/sales.component';
import { ReportsComponent } from './reports/reports.component';
import { ProfileComponent } from './profile/profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    ProductsComponent,
    SalesComponent,
    ReportsComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FontAwesomeModule
  ]
})
export class PagesModule { }
