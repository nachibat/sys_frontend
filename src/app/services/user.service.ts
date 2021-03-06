import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { LoginResponse, User, UserChangePassResponse, UserModifyResponse, UserResponse } from '../interfaces/user.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = environment.URL;
  public validated: boolean = false;
  public user!: User;
  public loading: boolean = false;

  constructor(private http: HttpClient,
              private router: Router) { }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, { username, password });
  }

  validateToken(): Promise<boolean> {
    if (this.validated) {
      return Promise.resolve(true);
    }
    const token = this.getToken();
    if (token === '') {
      this.router.navigate(['/login']);
      return Promise.resolve(false);  
    }
    return new Promise<boolean>(resolve => {
      this.loading = true;
      const headers = new HttpHeaders({
        Authorization: token
      });
      this.http.get<UserResponse>(`${this.url}/user`, { headers }).subscribe(resp => {
        if (resp.ok) {
          this.validated = true;
          this.user = resp.user;
          this.loading = false;
          resolve(true);
        } else {
          this.router.navigate(['/login']);
          this.loading = false;
          resolve(false);
        }
      }, err => {
        this.router.navigate(['/login']);
        this.loading = false;
        resolve(false);
      });
    });
  }

  modifyUser(id: string, userValues: any): Observable<UserModifyResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.put<UserModifyResponse>(`${this.url}/user/${id}`, userValues, { headers });
  }

  changePassword(username: string, password: string, newpassword: string): Observable<UserChangePassResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: token });
    const data = { username, password, newpassword }
    return this.http.patch<UserChangePassResponse>(`${this.url}/user`, data, { headers });
  }

}
