import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Output() focusEvent = new EventEmitter();

  public confirmationModal: boolean = false;
  public data: any = null;

  constructor(private modal: ElementRef,
              private container: ElementRef,
              public modalService: ModalService) { }

  ngOnInit(): void {
  }

  public closeModal(id1: string, id2: string): void {
    const modal = this.modal.nativeElement.querySelector(id1);
    const container = this.container.nativeElement.querySelector(id2);
    modal.classList.remove('fadeIn');
    modal.classList.add('fadeOut');
    container.classList.remove('slideIn');
    container.classList.add('slideOut');
    setTimeout(() => {
      this.modalService.confirmationModal = false;
      this.modalService.addModal = false;
      this.focusEvent.emit();
    }, 450);  
  }

  public confirmModal(): void {
    this.modalService.callback();
    this.data = null;
    this.closeModal('#modalConfirmation', '#container');
  }

  public confirmAddQuantity(): void {
    this.modalService.callback(this.data);
    this.data = null;
    this.closeModal('#addModal', '#addContainer');
  }

}
