import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faFileInvoice, faMoneyBillAlt, faFileInvoiceDollar, faWallet } from '@fortawesome/free-solid-svg-icons';

import { Product } from 'src/app/interfaces/product.response';
import { Sale } from 'src/app/interfaces/sales.response';
import { NavbarService } from 'src/app/services/navbar.service';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public icons = [faFileInvoice, faMoneyBillAlt, faFileInvoiceDollar, faWallet];
  public isOpen: boolean = false;
  public products: Product[] = [];
  public dailySales: number = 0;
  public dailyEarnings: number = 0;
  
  private sales: Sale[] = [];

  constructor(private navbarService: NavbarService,
              private productService: ProductService,
              private saleService: SaleService,
              private router: Router) { }

  ngOnInit(): void {
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => {
      this.isOpen = resp;
    });
    this.loadStock();
    this.loadSales();
  }

  loadStock(): void {
    this.productService.stockProducts().subscribe(resp => {
      this.products = resp.listProducts;
    });
  }

  loadSales(): void {
    this.saleService.saleList().subscribe(resp => {
      this.dailySales = resp.listSales.length;
      for (let i = 0; i < resp.listSales.length; i++) {
        const element = resp.listSales[i];
        this.dailyEarnings += element.total;
      }
    });
  }

  redirectReports(): void {
    this.router.navigate(['/reports']);
  }

}
