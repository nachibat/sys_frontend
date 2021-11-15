import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faChevronRight, faPrint } from '@fortawesome/free-solid-svg-icons';
import { Product } from 'src/app/interfaces/product.response';

import { ProductService } from 'src/app/services/product.service'

@Component({
  selector: 'app-report-stock',
  templateUrl: './report-stock.component.html',
  styleUrls: ['./report-stock.component.css']
})
export class ReportStockComponent implements OnInit {

  icons = [faChevronLeft, faChevronRight, faPrint];

  public loading = false;
  public stock: Product[] = [];

  private from: number = 0;
  private limit: number = 13;
  private next: boolean = true;
  private total!: number;
  private category!: string;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.total = this.limit;
    this.loadStock('kiosko');
  }

  loadStock(category: string): void {
    this.category = category;
    this.loading = true;
    this.productService.stockProducts(this.from, this.limit, 'quantity', category).subscribe(resp => {
      this.stock = resp.listProducts;
      if (this.stock.length === this.limit && this.total != resp.total) {
        this.next = true;
      } else {
        this.next = false;
      }
      this.loading = false;
    });
  }

  stockPrev(): void {
    if (this.from === 0) { return; }
    this.from -= this.limit;
    this.total -= this.limit;
    this.loadStock(this.category);
  }

  stockNext(): void {
    if (!this.next) { return; }
    this.from += this.limit;
    this.total += this.limit;
    this.loadStock(this.category);
  }

  onChange(event: any): void {
    this.from = 0;
    this.total = this.limit;
    this.loadStock(event.target.value);
  }

}
