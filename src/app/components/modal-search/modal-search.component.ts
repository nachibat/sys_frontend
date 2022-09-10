import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['../modal/modal.component.css']
})
export class ModalSearchComponent extends ModalComponent implements OnInit {

  public data = { price: null, type: 'kiosko' }

  super() { }

  ngOnInit(): void {
  }

  search() {
    this.modalService.callback(this.data);
    this.closeModal('#modal', '#container');
  }

}
