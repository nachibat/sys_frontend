import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Item, ItemSaleResponse, SaleResponse } from '../interfaces/sales.response';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private url: string = environment.URL;

  public items: Item[] = [];
  public total: number = 0;

  constructor(private http: HttpClient) { }

  cleanData(): void {
    this.items = [];
    this.total = 0;
  }

  createSale(id_user: string): Observable<SaleResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    const data = { id_user, total: this.total };
    return this.http.post<SaleResponse>(`${this.url}/sale`, data, { headers });
  }

  addItemSale(id_sale: string, barcode: string, price: number, quantity: number): Observable<ItemSaleResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    const data = { id_sale, barcode, price, quantity };
    return this.http.post<ItemSaleResponse>(`${this.url}/item_sale`, data, { headers });
  }

}
