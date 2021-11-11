import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faPlus, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

import { Product } from 'src/app/interfaces/product.response';
import { ModalService } from 'src/app/services/modal.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  private field: string = 'barcode';
  private subtotal: number = 0;

  isOpen: boolean = false;
  public icons = [faPlus, faTimes, faChevronLeft, faSearch];
  public date!: Date;
  public term!: any;
  public message: string = 'No se buscaron productos';
  public productsFound: Product[] = [];  

  constructor(private navbarService: NavbarService,
              private userService: UserService,
              private productService: ProductService,
              public saleService: SaleService,
              private toastService: ToastrService,
              private modalService: ModalService) { }

  ngOnInit(): void {
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => {
      this.isOpen = resp;
    });
    this.date = new Date();
  }

  searchProducts(): void {
    if (this.term === undefined || this.term.trim() === '') { return; }
    if (!isNaN(parseFloat(this.term)) && !isNaN(this.term - 0)) {
      this.field = 'barcode';
    } else {
      this.field = 'description';
    }
    this.message = 'No se encontraron productos!'
    this.productService.searchProducts(0, 9, this.field, this.term.trim()).subscribe(resp => {
      if (this.field === 'barcode') {
        this.productsFound = resp.listProducts;
        this.selectItem(0);
      } else {
        this.productsFound = resp.listProducts;
      }
    });
  }

  selectItem(index: number): void {
    if (this.saleService.items.length >= 9) {
      this.toastService.warning('Solo se permiten 9 articulos por venta.', 'Advertencia', { timeOut: 7000 });
      return;
    }
    this.term = null;
    if (this.productsFound[index].quantity === 0) {
      this.toastService.error('No hay suficiente stock!', 'Error al agregar.', { timeOut: 7000 });
      return;
    }
    this.addItem(this.productsFound[index]);
    this.productsFound.splice(index, 1);
  }

  addItem(product: Product): void {
    let item = {
      barcode: product.barcode,
      description: product.description,
      stock: product.quantity,
      quantity: 1,
      price: product.price,
      subtotal: 0
    };
    this.subtotal = item.quantity * item.price;
    item.subtotal = this.subtotal;
    this.saleService.items.push(item);    
    this.totalCount();
  }

  removeItem(index: number): void {
    this.saleService.items.splice(index, 1);
    this.totalCount();
  }

  totalCount(): void {
    this.saleService.total = 0;
    for (let i = 0; i < this.saleService.items.length; i++) {
      const element = this.saleService.items[i];
      this.saleService.total += element.subtotal;
    }
  }

  increaseItem(index: number): void {
    this.modalService.addModal = true;
    this.modalService.title = 'Incrementar cantidad';
    this.modalService.message = `Ingrese la cantidad que desea vender (stock: ${this.saleService.items[index].stock})`;
    this.modalService.execCallback((data: any) => {
      if (data === null) { return; }
      if (data > this.saleService.items[index].stock) {
        this.toastService.error('No hay suficiente stock!', 'Error al incrementar');        
        return;
      }
      if (data === 0) {
        this.toastService.error('La cantidad ingresada debe ser mayor a cero!', 'Error al incrementar');        
        return;
      }
      this.saleService.items[index].quantity = data;
      this.subtotal = this.saleService.items[index].quantity * this.saleService.items[index].price;
      this.saleService.items[index].subtotal = this.subtotal;
      this.totalCount();
    });
  }

  makeSale(): void {
    if (this.saleService.items.length === 0) { return; }
    this.modalService.confirmationModal = true;
    this.modalService.title = 'Confirmación';
    this.modalService.message = '¿Está seguro que desea realizar la venta?'
    this.modalService.execCallback(() => {
      this.saleService.createSale(this.userService.user._id).subscribe(resp => {
        for (let i = 0; i < this.saleService.items.length; i++) {
          const item = this.saleService.items[i];
          this.saleService.addItemSale(resp.saleCreated._id, item.barcode, item.price, item.quantity).subscribe(resp2 => {
            const newStock = item.stock - item.quantity;
            if (newStock < 5 && newStock > 0) {
              this.toastService.warning(`Stock mínimo. Favor de reponer ${item.description}.`, 'Advertencia!', { timeOut: 10000 });
            }
            if (newStock === 0 ) {
              this.toastService.error(`Se ha quedado sin mercadería. Favor de ${item.description}.`, 'Advertencia', { timeOut: 10000 });
            }
            this.productService.reduceStock(item.barcode, newStock).subscribe();
          }, err => {
            this.toastService.error('Ocurrio un error', 'Error');
            console.log(err);
          });
        }
        this.toastService.success('Venta realizada correctamente', 'Información', { timeOut: 4000 });
        this.saleService.cleanData();
      }, err => {
        this.toastService.error('Ocurrio un error', 'Error');
        console.log(err);
      });
    });
  }

}
