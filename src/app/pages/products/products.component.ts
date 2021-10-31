import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faChevronLeft, faChevronRight, faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormProductComponent } from 'src/app/components/form-product/form-product.component';
import { NavbarService } from 'src/app/services/navbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public icons = [faPlus, faEdit, faTrash, faChevronLeft, faChevronRight];
  public isOpen: boolean = false;
  public admin = false;


  constructor(private navbarService: NavbarService,
              private userService: UserService,
              public formProduct: FormProductComponent) {
  }

  ngOnInit(): void {
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => {
      this.isOpen = resp;
    });
    if (this.userService.user.role === 'ADMIN_ROLE') {
      this.admin = true;
    } else {
      this.admin = false;
    }
  }

  addProduct(): void {    
    if (!this.admin) { return; }
    console.log('abrir');
    this.formProduct.openModal();
  }

}
