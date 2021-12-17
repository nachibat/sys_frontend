import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Item, ItemSaleResponse, Sale, SaleItemListResponse, SaleListResponse, SaleResponse } from '../interfaces/sales.response';

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

  addItemSale(id_sale: string, product: string, price: number, quantity: number): Observable<ItemSaleResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    const data = { id_sale, product, price, quantity };
    return this.http.post<ItemSaleResponse>(`${this.url}/item_sale`, data, { headers });
  }

  saleList(): Observable<SaleListResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<SaleListResponse>(`${this.url}/sale/list`, { headers });
  }

  saleListRange(from: string, to: string): Promise<SaleListResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<SaleListResponse>(`${this.url}/sale/search?from=${from}&to=${to}`, { headers }).toPromise();
  }

  itemSaleList(idSale: string): Promise<SaleItemListResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<SaleItemListResponse>(`${this.url}/item_sale/sale/${idSale}`, { headers }).toPromise();
  }

  itemSaleListObs(idSale: string): Observable<SaleItemListResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<SaleItemListResponse>(`${this.url}/item_sale/sale/${idSale}`, { headers });
  }

}
