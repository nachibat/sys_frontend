import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private userService: UserService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.validateToken();
  }
  
}
