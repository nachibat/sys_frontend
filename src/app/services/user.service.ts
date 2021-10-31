import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { LoginResponse, User, UserResponse } from '../interfaces/user.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = environment.URL;
  public validated: boolean = false;
  public user!: User;

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
      const headers = new HttpHeaders({
        Authorization: token
      });
      this.http.get<UserResponse>(`${this.url}/user`, { headers }).subscribe(resp => {
        if (resp.ok) {
          this.validated = true;
          this.user = resp.user;
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

}
