import { Component, OnDestroy, OnInit } from '@angular/core';
import { faChevronLeft, faChevronRight, faClipboard, faEdit, faPlus, faRedoAlt, faSort, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product.response';
import { ModalService } from 'src/app/services/modal.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

import { PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { ITable } from 'pdfmake-wrapper/lib/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
PdfMakeWrapper.setFonts(pdfFonts);
type TableRow = [string, string, string, number, string, string, string];

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  
  public icons = [faPlus, faEdit, faTrash, faChevronLeft, faChevronRight, faSort, faRedoAlt, faClipboard];
  public isOpen: boolean = false;
  public admin = false;
  public products: Product[] = [];

  private from: number = 0;
  private limit: number = 8;
  private order: string = 'description';
  private next: boolean = true;
  private total!: number;
  private searchMode: boolean = false;
  private searchParams: string[] = [];
  private position: number = 0;


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
    if (this.productService.search) {
      this.searchFor(this.productService.paramsSearch);
    } else {
      this.loadProducts();
    }
  }

  ngOnDestroy(): void {
    this.searchMode = false;
    this.productService.search = false;
    this.productService.paramsSearch = [];
  }

  addProduct(): void {    
    if (!this.admin) { return; }
    this.productService.openForm = true;
  }

  loadProducts(): void {
    this.productService.loading = true;
    this.productService.getProducts(this.from, this.limit, this.order).subscribe(resp => {
      this.products = resp.listProducts;
      if (this.products.length === this.limit && this.total != resp.total) {
        this.next = true;
      } else {
        this.next = false;
      }
      this.productService.loading = false;
    });
  }

  listNext(): void {
    if (!this.next) { return; }
    this.from += this.limit;    
    this.total += this.limit;    
    if (this.searchMode) {
      this.searchFor(this.searchParams);
    } else {
      this.loadProducts();
    }
  }

  listPrev(): void {
    if (this.from === 0) { return; }
    this.from -= this.limit;
    this.total -= this.limit;
    if (this.searchMode) {
      this.searchFor(this.searchParams);
    } else {
      this.loadProducts();
    }
  }

  edit(product: Product, pos: number): void {
    this.position = pos;
    this.productService.openForm = true;
    this.productService.edit = true;
    this.productService.product = product;
  }
  remove(id: string, pos: number): void {
    this.modalService.confirmationModal = true;
    this.modalService.confirmButton = true;
    this.modalService.title = 'Confirmaci??n';
    this.modalService.message = '??Est?? seguro que desea eliminar el producto?';
    this.modalService.execCallback(() => {
      this.productService.loading = true;
      this.productService.deleteProduct(id).subscribe(resp => {
        console.log(resp);
        this.toastService.success('Se elimin?? el producto correctamente', 'Informaci??n');
        this.products.splice(pos, 1);
        this.productService.loading = false;
      }, err => {
        this.handleError(err);
      });      
    });
  }

  addQuantity(id: string, quantity: number, pos: number): void {
    this.position = pos;
    this.modalService.addModal = true;
    this.modalService.title = 'Agregar cantidad';
    this.modalService.message = 'Ingrese cantidad al producto';
    this.modalService.execCallback((data: any) => {
      if (data === null) { return; }
      this.productService.loading = true;
      this.productService.modifyProduct(id, { quantity: data + quantity }).subscribe(resp => {
        const newProduct = resp.productModified;
        this.toastService.success('Se increment?? el stock correctamente', 'Informaci??n');
        this.reloadArray(this.position, newProduct);
      }, err => {
        this.handleError(err);
      });
    });
  }

  reloadArray(position: number, product: Product): void {
    this.products[position] = product;
    this.productService.loading = false;
  }

  receiveMessage($event: any): void {
    if ($event) {
      this.reloadArray(this.position, this.productService.product);
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
    this.productService.loading = false;
    if (err.status === 401) {
      this.toastService.error('Problemas de autorizacion. Cerrar sesi??n y volver a iniciar!', 'Error!', { timeOut: 7000 });
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

  searchFor($event: any): void {
    this.searchMode = true;
    this.searchParams = $event;
    this.productService.loading = true;
    this.productService.searchProducts(this.from, this.limit, $event[0], $event[1]).subscribe(resp => {
      this.products = resp.listProducts;
      if (this.products.length === this.limit && this.total != resp.total) {
        this.next = true;
      } else {
        this.next = false;
      }
      this.productService.loading = false;
    });
  }

  reloadList(): void {
    this.searchMode = false;
    this.productService.search = false;
    this.productService.paramsSearch = [];
    this.from = 0;
    this.limit = 8;
    this.order = 'description'
    this.loadProducts();
  }

  generatePdf(): void {
    this.productService.getProducts(0, 5000, 'description').subscribe(resp => {
      console.log(resp);
      const product = resp.listProducts;
      const pdf = new PdfMakeWrapper();
      pdf.add(new Txt(new Date().toLocaleDateString()).alignment('right').end);
      pdf.add('\n');
      pdf.add(new Txt('Listado de productos').alignment('center').fontSize(16).bold().end);
      pdf.add('\n');
      pdf.add(new Txt(`Total de productos registrados: ${resp.total}`).alignment('left').fontSize(12).end);
      pdf.add('\n');
      pdf.add(this.createTable(product));
      pdf.watermark(new Txt('S&S Kiosko').color('lightgrey').end);
      pdf.create().open();
    });
  }

  createTable(data: Product[]): ITable {
    return new Table([
      ['C??digo', 'Descripci??n', 'Categ.', 'Cant.', 'Costo', '% Gan.', 'P. Final'],
      ...this.extractData(data)
    ])
    .fontSize(10)
    .widths([75, '*', 50, 25, 30, 35, 35])
    .layout('lightHorizontalLines')
    .headerRows(1)
    .end;
  }

  extractData(data: Product[]): TableRow[] {
    return data.map(row => {
      let cost = '';
      if (row.cost_price) { cost = `$ ${row.cost_price}` } else { cost = '-' }
      let profit = '';
      if (row.percent_profit) { profit = `% ${row.percent_profit}` } else { profit = '-' }
      const cat = row.category.charAt(0).toUpperCase() + row.category.slice(1);
      return [row.barcode, row.description, cat, row.quantity, cost, profit, `$ ${row.price}`];
    });
  }

}
