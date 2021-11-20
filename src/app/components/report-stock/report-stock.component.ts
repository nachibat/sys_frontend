import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faChevronRight, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import { PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
PdfMakeWrapper.setFonts(pdfFonts);
type TableRow = [string, number, number, number];

import { Product } from 'src/app/interfaces/product.response';
import { ProductService } from 'src/app/services/product.service'

@Component({
  selector: 'app-report-stock',
  templateUrl: './report-stock.component.html',
  styleUrls: ['./report-stock.component.css']
})
export class ReportStockComponent implements OnInit {

  icons = [faChevronLeft, faChevronRight, faFilePdf];

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

  generatePdf(): void {
    this.productService.stockProducts(0, 2000, 'quantity', this.category).subscribe(resp => {
      const stock = resp.listProducts;
      const pdf = new PdfMakeWrapper();
      pdf.add(new Txt(new Date().toLocaleDateString()).alignment('right').end);
      pdf.add('\n');
      pdf.add(this.createTable(stock));
      pdf.watermark(new Txt('S&S Kiosko').color('lightgrey').end);
      pdf.create().open();
    });
  }

  createTable(data: Product[]): ITable {
    return new Table([
      ['Descripción', 'Cantidad', 'Precio Costo $', 'Precio Final $'],
      ...this.extractData(data)
    ])
    .widths(['*', 60, 80, 80])
    .layout('lightHorizontalLines')
    .end;
  }

  extractData(data: Product[]): TableRow[] {
    return data.map(row => [row.description, row.quantity, (row.cost_price || 0), row.price]);
  }

}
