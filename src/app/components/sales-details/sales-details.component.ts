import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { CashService } from 'src/app/services/cash.service';
import { SaleService } from 'src/app/services/sale.service';

@Component({
  selector: 'app-sales-details',
  templateUrl: './sales-details.component.html',
  styleUrls: ['./sales-details.component.css']
})
export class SalesDetailsComponent implements OnInit {

  public loading: boolean = false;
  public dateFrom: string = new Date().toISOString().slice(0, 10);
  public dateTo: string = new Date().toISOString().slice(0, 10);
  public icons = [faSearch];
  public total: number[] = [0, 0];
  public withdrawal: number = 0;
  public cash: number[] = [0, 0];
  public card: number[] = [0, 0];
  public mp: number[] = [0, 0];
  public notFound: boolean = false;

  constructor(private saleService: SaleService,
              private cashService: CashService,
              private toastService: ToastrService) { }

  ngOnInit(): void {
  }

  async search() {
    if (this.loading) { return; }
    this.loading = true;
    this.clearData();
    this.withdrawal = 0;
    this.cashService.cashListRange(this.dateFrom, this.dateTo).subscribe(resp => {
      for (let i = 0; i < resp.listCashes.length; i++) {
        const element = resp.listCashes[i];
        this.withdrawal += element.withdrawals;
      }
    });
    const resp = await this.saleService.saleListRange(this.dateFrom, this.dateTo);
    if (!resp.ok) {
      this.loading = false;
      this.toastService.error('Ocurrio un error. Consulte con el administrador', 'Error');
      console.log(resp);
    }
    if (resp.total === 0) {
      this.notFound = true;
    }
    this.total[0] = resp.total;
    for (let i = 0; i < resp.total; i++) {
      const element = resp.listSales[i];
      this.total[1] += element.total;
      switch (element.payment) {
        case 'CASH':
          this.cash[0] ++;
          this.cash[1] += element.total;
          break;
        case 'CARD':
          this.card[0] ++;
          this.card[1] += element.total;
          break;
        case 'MP':
          this.mp[0] ++;
          this.mp[1] += element.total;
          break;
        default:
          break;
      }
    }
    this.loading = false;
  }

  clearData(): void {
    this.total = [0, 0];
    this.withdrawal = 0;
    this.cash = [0, 0];
    this.card = [0, 0];
    this.mp = [0, 0];
    this.notFound = false;
  }

}
