import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faChevronRight, faFilePdf } from '@fortawesome/free-solid-svg-icons';
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

  constructor(private saleService: SaleService) { }

  ngOnInit(): void {
    this.loadSalesItems();
  }

  loadSalesItems() {
    this.saleService.saleList().subscribe(resp => {
      this.sales = resp.listSales;
      for (let i = 0; i < this.sales.length; i++) {
        const element = this.sales[i];
        this.total += element.total;
        this.saleService.itemSaleList(element._id).subscribe(resp => {
          this.salesItems.push(...resp.listItems);
        });
      }
      console.log(this.salesItems);
    });
  }

  findProduct(barcode: string): void {
    // TODO: Create endpoint in backend
  }

  salesPrev(): void {
    console.log('anterior');
  }

  salesNext(): void {
    console.log('siguiente');
  }

  generatePdf(): void {
    console.log('pdf');
  }

}
