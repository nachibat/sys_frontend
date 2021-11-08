import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product, ProductDeletedResponse, ProductListResponse, ProductModifiedResponse, ProductResponse } from '../interfaces/product.response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public openForm: boolean = false;
  public edit: boolean = false;
  public product!: Product;
  public loading: boolean = false;
  public search: boolean = false;
  public paramsSearch: string[] = [];
  private url: string = environment.URL;

  constructor(private http: HttpClient) { }

  getProducts(from: number = 0, limit: number = 11, order: string = 'description'): Observable<ProductListResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<ProductListResponse>(`${this.url}/product/list?from=${from}&limit=${limit}&order=${order}`, { headers });
  }

  searchProducts(from: number = 0, limit: number = 5, field: string = 'description', term: any = ''): Observable<ProductListResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<ProductListResponse>(`${this.url}/product/search?from=${from}&limit=${limit}&field=${field}&term=${term}`, { headers });
  }

  stockProducts(from: number = 0, limit: number = 10, order: string = 'quantity', category: string = 'kiosko'): Observable<ProductListResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<ProductListResponse>(`${this.url}/product/stock?from=${from}&limit=${limit}&order=${order}&category=${category}`, { headers });
  }

  createProduct(product: Product): Observable<ProductResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });    
    return this.http.post<ProductResponse>(`${this.url}/product`, product, { headers });
  }

  modifyProduct(id: string, product: any): Observable<ProductModifiedResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.put<ProductModifiedResponse>(`${this.url}/product/${id}`, product, { headers });
  }

  deleteProduct(id: string): Observable<ProductDeletedResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.delete<ProductDeletedResponse>(`${this.url}/product/${id}`, { headers });
  }

}
