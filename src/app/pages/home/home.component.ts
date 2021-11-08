import { Component, OnInit } from '@angular/core';
import { faFileInvoice, faMoneyBillAlt, faFileInvoiceDollar, faWallet } from '@fortawesome/free-solid-svg-icons';

import { Product } from 'src/app/interfaces/product.response';
import { NavbarService } from 'src/app/services/navbar.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public icons = [faFileInvoice, faMoneyBillAlt, faFileInvoiceDollar, faWallet];
  public isOpen: boolean = false;
  public products: Product[] = [];

  constructor(private navbarService: NavbarService,
              private productService: ProductService) { }

  ngOnInit(): void {
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => {
      this.isOpen = resp;
    });
    this.loadStock();
  }

  loadStock(): void {
    this.productService.stockProducts().subscribe(resp => {
      this.products = resp.listProducts;
    });
  }

}
