import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SaleService } from 'src/app/services/sale.service';

@Component({
  selector: 'app-sales-range',
  templateUrl: './sales-range.component.html',
  styleUrls: ['./sales-range.component.css']
})
export class SalesRangeComponent implements OnInit {

  public icons = [faSearch];
  public dateFrom: string = new Date().toISOString().slice(0,10);
  public dateTo: string = new Date().toISOString().slice(0,10);
  public loading: boolean = false;
  public sales: any[] = [];

  constructor(private saleService: SaleService) { }

  ngOnInit(): void {
  }

  async search() {
    this.loading = true;
    this.sales = [];
    const resp = await this.saleService.saleListRange(this.dateFrom, this.dateTo);
    for (let i = 0; i < resp.listSales.length; i++) {
      const element = resp.listSales[i];
      let items = [];
      const resp2 = await this.saleService.itemSaleList(element._id);
      for (let j = 0; j < resp2.listItems.length; j++) {
        const element2 = resp2.listItems[j];
        let barcode;
        let description;
        if (element2.product) {
          barcode = element2.product.barcode;
          description = element2.product.description;
        } else {
          barcode = 'XXXXX';
          description = 'XXXXXXX XXXXXXXXXX'
        }
        const item = {
          quantity: element2.quantity,
          barcode,
          description,
          subtotal: element2.quantity * element2.price
        }
        items.push(item);
      }
      let sale = {
        items,
        date: element.createdAt,
        user: element.id_user.username,
        total: element.total
      };
      this.sales.push(sale);
    }
    this.loading = false;
  }

}
