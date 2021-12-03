import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ListItem, Sale } from 'src/app/interfaces/sales.response';
import { SaleService } from 'src/app/services/sale.service';

@Component({
  selector: 'app-cigarettes',
  templateUrl: './cigarettes.component.html',
  styleUrls: ['./cigarettes.component.css']
})
export class CigarettesComponent implements OnInit {

  public loading: boolean = false;
  public icons = [faChevronLeft, faChevronRight, faSearch];
  public sales: Sale[] = [];
  public salesItems: ListItem[] = [];
  public showedProducts: ListItem[] = [];
  public dateFrom: string = new Date().toISOString().slice(0, 10);
  public dateTo: string = new Date().toISOString().slice(0, 10);
  public total: number = 0;

  private from: number = 0;
  private limit: number = 11;
  private totalItems!: number;
  private next: boolean = true;

  constructor(private saleService: SaleService) { }

  ngOnInit(): void {
    this.totalItems = this.limit;
    this.search();
  }

  async search() {
    this.loading = true;
    this.salesItems = [];
    this.showedProducts = [];
    this.total = 0;
    const resp = await this.saleService.saleListRange(this.dateFrom, this.dateTo);
    this.sales = resp.listSales;
    for (let i = 0; i < this.sales.length; i++) {
      const element = this.sales[i];
      this.saleService.itemSaleList(element._id).subscribe(resp => {
        for (let j = 0; j < resp.listItems.length; j++) {
          const element = resp.listItems[j];
          if (element.product.description.toLowerCase().search('cigarrillo') >= 0){
            this.salesItems.push(element);
            this.total += (element.quantity * element.price)
          }
        }
        if (i === (this.sales.length - 1)) {
          this.reorderProducts();
        }
      });
    }
    if (this.sales.length === 0) {
      this.loading = false;
    }
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
    this.loading = false;
  }

  listPrev(): void {
    if (this.from === 0) { return; }
    this.from -= this.limit;
    this.totalItems -= this.limit;
    this.reorderProducts();
  }

  listNext(): void {
    if (!this.next) { return; }
    this.from += this.limit;
    this.totalItems += this.limit;
    this.reorderProducts();
  }

}
