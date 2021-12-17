import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faChevronRight, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import { PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
PdfMakeWrapper.setFonts(pdfFonts);
type TableRow = [number, string, string, number];

import { ListItem, Sale } from 'src/app/interfaces/sales.response';
import { SaleService } from 'src/app/services/sale.service';

@Component({
  selector: 'app-report-sales',
  templateUrl: './report-sales.component.html',
  styleUrls: ['./report-sales.component.css']
})
export class ReportSalesComponent implements OnInit {

  public loading: boolean = false;
  public icons = [faFilePdf, faChevronLeft, faChevronRight];
  public sales: Sale[] = [];
  public salesItems: ListItem[] = [];
  public total: number = 0;
  public showedProducts: ListItem[] = [];
  
  private from: number = 0;
  private limit: number = 12;
  private totalItems!: number;
  private next: boolean = true;

  constructor(private saleService: SaleService) { }

  ngOnInit(): void {
    this.totalItems = this.limit;
    this.loadSalesItems();
  }

  loadSalesItems() {
    this.loading = true;
    this.saleService.saleList().subscribe(async resp => {
      this.sales = resp.listSales;
      for (let i = 0; i < this.sales.length; i++) {
        const element = this.sales[i];
        this.total += element.total;
        this.saleService.itemSaleListObs(element._id).subscribe(resp => {
          this.salesItems.push(...resp.listItems);
          if (i >= (this.sales.length - 1)) {
            this.reorderProducts();
          }
        });
      }
      this.loading = false;
    });
  }

  reorderProducts(): void {
    this.showedProducts = [];
    let count: number = 0;
    for (let i = this.from; i < this.salesItems.length; i++) {
      const element = this.salesItems[i];
      if (count < this.limit) {
        this.showedProducts.push(element);
      }
      count++;
    }
    if (this.totalItems >= this.salesItems.length)
    {
      this.next = false;
    } else {
      this.next = true;
    }
  }

  salesPrev(): void {
    if (this.from === 0) { return; }
    this.from -= this.limit;
    this.totalItems -= this.limit;
    this.reorderProducts();
  }

  salesNext(): void {
    if (!this.next) { return; }
    this.from += this.limit;
    this.totalItems += this.limit;
    this.reorderProducts();
  }

  generatePdf(): void {
    const pdf = new PdfMakeWrapper();
    pdf.add(new Txt(new Date().toLocaleDateString()).alignment('right').end);
    pdf.add('\n');
    pdf.add(this.createTable(this.salesItems));
    pdf.add(new Txt(`\nTotal: $ ${this.total}`).alignment('right').bold().fontSize(20).end)
    pdf.watermark(new Txt('S&S Kiosko').color('lightgrey').end);
    pdf.create().open();
  }

  createTable(data: ListItem[]): ITable {
    return new Table([
      ['Cantidad', 'Código', 'Descripción', 'Subtotal $'],
      ...this.extractData(data)
    ])
    .widths([60, 100, '*', 60])
    .layout('lightHorizontalLines')
    .end
  }

  extractData(data: ListItem[]): TableRow[] {
    return data.map(row => {
      let barcode = '';
      let desc = '';
      if (row.product === null) {
        barcode = 'XXXXXXXX';
        desc = 'PRODUCTO ELIMINADO'
      } else {
        barcode = row.product.barcode;
        desc = row.product.description;
      }
      return [row.quantity, barcode, desc, (row.price * row.quantity)];
    });
  }

}
