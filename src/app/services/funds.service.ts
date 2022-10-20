import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FundListResponse, FundsCreateResponse, FundsLastoneResponse } from '../interfaces/fund.response';

@Injectable({
  providedIn: 'root'
})
export class FundsService {

  private url: string = environment.URL;

  constructor(private http: HttpClient) { }

  fundListRange(from: string, to: string) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<FundListResponse>(`${this.url}/fund/search/?from=${from}&to=${to}`, { headers });
  }

  getLastone() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<FundsLastoneResponse>(`${this.url}/fund/lastone`, { headers });
  }

  createFund(fundRegister: any) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.post<FundsCreateResponse>(`${this.url}/fund`, fundRegister, { headers });
  }

}
