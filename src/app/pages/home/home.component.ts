import { Component, OnInit } from '@angular/core';
import { faFileInvoice, faMoneyBillAlt, faFileInvoiceDollar, faWallet } from '@fortawesome/free-solid-svg-icons';

import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  icons = [faFileInvoice, faMoneyBillAlt, faFileInvoiceDollar, faWallet];
  isOpen: boolean = false;

  constructor(private navbarService: NavbarService) { }

  ngOnInit(): void {
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => {
      this.isOpen = resp;
    });
  }

}
