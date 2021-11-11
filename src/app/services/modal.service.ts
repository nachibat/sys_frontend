import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public title: string = '';
  public message: string = '';
  public confirmationModal: boolean = false;
  public addModal: boolean = false;
  public callback: any;

  constructor() { }

  execCallback(callback: any): void {
    this.callback = callback;
  }

}
