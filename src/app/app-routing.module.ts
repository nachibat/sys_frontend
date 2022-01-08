import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from './guards/user.guard';
import { CashRegisterComponent } from './pages/cash-register/cash-register.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SalesComponent } from './pages/sales/sales.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'sales',
    component: SalesComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'suppliers',
    component: SuppliersComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'cash-register',
    component: CashRegisterComponent,
    canActivate: [UserGuard]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
