import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faChevronRight, faEdit, faPlus, faSort, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product.response';
import { ModalService } from 'src/app/services/modal.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  
  public icons = [faPlus, faEdit, faTrash, faChevronLeft, faChevronRight, faSort];
  public isOpen: boolean = false;
  public admin = false;
  public products: Product[] = [];

  private from: number = 0;
  private limit: number = 11;
  private order: string = 'description';
  private next: boolean = true;
  private total!: number;


  constructor(private navbarService: NavbarService,
              private userService: UserService,
              public productService: ProductService,
              private modalService: ModalService,
              private toastService: ToastrService) {
  }

  ngOnInit(): void {
    this.total = this.limit;
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => {
      this.isOpen = resp;
    });
    if (this.userService.user.role === 'ADMIN_ROLE') {
      this.admin = true;
    } else {
      this.admin = false;
    }
    this.loadProducts();
  }

  addProduct(): void {    
    if (!this.admin) { return; }
    this.productService.openForm = true;
  }

  loadProducts(): void {
    this.productService.getProducts(this.from, this.limit, this.order).subscribe(resp => {
      this.products = resp.listProducts;
      if (this.products.length === this.limit && this.total != resp.total) {
        this.next = true;
      } else {
        this.next = false;
      }
    });
  }

  listNext(): void {
    if (!this.next) { return; }
    this.from += this.limit;    
    this.total += this.limit;    
    this.loadProducts();
  }

  listPrev(): void {
    if (this.from === 0) { return; }
    this.from -= this.limit;
    this.total -= this.limit;
    this.loadProducts();
  }

  edit(product: Product): void {
    this.productService.openForm = true;
    this.productService.edit = true;
    this.productService.product = product;
  }
  remove(id: string): void {
    this.modalService.confirmationModal = true;
    this.modalService.execCallback(() => {
      this.productService.deleteProduct(id).subscribe(resp => {
        console.log(resp);
        this.toastService.success('Se eliminó el producto correctamente', 'Información');
        this.loadProducts();
      }, err => {
        this.handleError(err);
      });      
    });
  }

  addQuantity(id: string, quantity: number) {
    this.modalService.addModal = true;
    this.modalService.execCallback((data: any) => {
      if (data === null) { return; }
      this.productService.modifyProduct(id, { quantity: data + quantity }).subscribe(resp => {
        this.toastService.success('Se incrementó el stock correctamente', 'Información');
        this.loadProducts();
      }, err => {
        this.handleError(err);
      });
    });
  }

  receiveMessage($event: any): void {
    if ($event) {
      this.loadProducts();
    }
  }

  reorderList(orderby: string): void {
    if (orderby === this.order) {
      this.order = '-' + orderby;
      this.from = 0;
    } else {
      this.order = orderby;
    }
    this.loadProducts();
  }

  handleError(err: any): void {
    if (err.status === 401) {
      this.toastService.error('Problemas de autorizacion. Cerrar sesión y volver a iniciar!', 'Error!', { timeOut: 7000 });
      console.log(err.error);
    } 
    if (err.status === 403) {
      this.toastService.error('Problemas de autorizacion. El usuario no tiene permisos!', 'Error!', { timeOut: 7000 });
      console.log(err.error);
    } else {
      this.toastService.error('Problemas con el servidor', 'Error!', { timeOut: 7000 });
      console.log(err);
    }
  }

}
