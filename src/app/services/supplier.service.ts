import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateSupplierResponse, DeleteSupplierResponse, ModifySupplierResponse, Supplier, SupplierListResponse } from '../interfaces/supplier.response';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private url: string = environment.URL;

  constructor(private http: HttpClient) { }

  getSupplierList(): Observable<SupplierListResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<SupplierListResponse>(`${this.url}/supplier/list?from=0&limit=100&order=name`, { headers });
  }

  createSupplier(supplier: Supplier): Observable<CreateSupplierResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.post<CreateSupplierResponse>(`${this.url}/supplier`, supplier, { headers });
  }

  modifySupplier(id: string, supplier: any): Observable<ModifySupplierResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.put<ModifySupplierResponse>(`${this.url}/supplier/${id}`, supplier, { headers });
  }

  deleteSupplier(id: string): Observable<DeleteSupplierResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.delete<DeleteSupplierResponse>(`${this.url}/supplier/${id}`, { headers });
  }

}
