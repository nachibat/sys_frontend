import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from './topbar/topbar.component';



@NgModule({
  declarations: [
    NavbarComponent,
    TopbarComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    TopbarComponent
  ]
})
export class ComponentsModule { }
