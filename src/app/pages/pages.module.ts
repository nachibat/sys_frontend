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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr';
import { FormProductComponent } from '../components/form-product/form-product.component';
import { RouterModule } from '@angular/router';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { CashRegisterComponent } from './cash-register/cash-register.component';
import { FundsComponent } from './funds/funds.component';



@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    ProductsComponent,
    SalesComponent,
    ReportsComponent,
    ProfileComponent,
    SuppliersComponent,
    CashRegisterComponent,
    FundsComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule,
    ToastrModule.forRoot()
  ],
  providers: [
    FormProductComponent
  ]
})
export class PagesModule { }
