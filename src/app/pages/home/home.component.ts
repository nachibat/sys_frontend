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
  public monthlySales: number = 0;
  public monthlyEarnings: number = 0;
  public dailyEarningsCash: number = 0;

  public sales: Sale[] = [];

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
    this.loadDailySales();
    this.loadMonthlySales();
  }

  loadStock(): void {
    this.productService.stockProducts().subscribe(resp => {
      this.products = resp.listProducts;
    });
  }

  loadDailySales(): void {
    this.saleService.saleList().subscribe(resp => {
      this.dailySales = resp.listSales.length;
      for (let i = 0; i < resp.listSales.length; i++) {
        const element = resp.listSales[i];
        this.dailyEarnings += element.total;
        if (element.payment === 'CASH') {
          this.dailyEarningsCash += element.total;
        }
      }
    });
  }

  async loadMonthlySales() {
    this.monthlyEarnings = 0;
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
    const to = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);
    const resp = await this.saleService.saleListRange(from, to);
    this.sales = resp.listSales;
    this.monthlySales = this.sales.length;
    for (let i = 0; i < this.sales.length; i++) {
      const element = this.sales[i];
      this.monthlyEarnings += element.total;
    }    
  }
  
  redirectReports(): void {
    this.router.navigate(['/reports']);
  }

}
