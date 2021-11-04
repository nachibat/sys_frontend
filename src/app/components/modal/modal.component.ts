import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  public confirmationModal: boolean = false;

  constructor(private modal: ElementRef,
              private container: ElementRef,
              public modalService: ModalService) { }

  ngOnInit(): void {
  }

  public closeModal(): void {
    const modal = this.modal.nativeElement.querySelector("#modalConfirmation");
    const container = this.container.nativeElement.querySelector("#container");
    modal.classList.remove('fadeIn');
    modal.classList.add('fadeOut');
    container.classList.remove('slideIn');
    container.classList.add('slideOut');
    setTimeout(() => {
      this.modalService.confirmationModal = false;
    }, 450);  
  }

  public confirmModal(): void {
    this.modalService.callback();
    this.closeModal();
  }

}
