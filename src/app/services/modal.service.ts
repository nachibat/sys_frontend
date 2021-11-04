import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public confirmationModal: boolean = false;
  public callback: any;

  constructor() { }

  execCallback(callback: any): void {
    this.callback = callback;
  }

}
