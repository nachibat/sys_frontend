import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product, ProductResponse } from '../interfaces/product.response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public openForm = false;
  private url: string = environment.URL;

  constructor(private http: HttpClient) { }

  createProduct(product: Product): Observable<ProductResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });    
    return this.http.post<ProductResponse>(`${this.url}/product`, product, { headers });
  }

}
