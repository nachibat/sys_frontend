import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateCashResponse, ListCashResponse } from '../interfaces/cash.response';

@Injectable({
  providedIn: 'root'
})
export class CashService {

  private url: string = environment.URL;

  constructor(private http: HttpClient) { }

  createCash(cashRegister: any): Observable<CreateCashResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.post<CreateCashResponse>(`${this.url}/cash`, cashRegister, { headers });
  }

  cashListRange(from: string, to: string): Observable<ListCashResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<ListCashResponse>(`${this.url}/cash/search/?from=${from}&to=${to}`, { headers });
  }

  cashListRangePromise(from: string, to: string): Promise<ListCashResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<ListCashResponse>(`${this.url}/cash/search/?from=${from}&to=${to}`, { headers }).toPromise();
  }

}
