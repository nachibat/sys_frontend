import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faPlus, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Product } from 'src/app/interfaces/product.response';

import { NavbarService } from 'src/app/services/navbar.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  private field: string = 'barcode';

  isOpen: boolean = false;
  public icons = [faPlus, faTimes, faChevronLeft, faSearch];
  public date!: Date;
  public term!: any;
  public message: string = 'No se buscaron productos';
  public productsFound: Product[] = [];

  constructor(private navbarService: NavbarService,
              private productService: ProductService) { }

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
    this.productService.searchProducts(0, 10, this.field, this.term.trim()).subscribe(resp => {
      this.productsFound = resp.listProducts;
      console.log(this.productsFound);
    });
  }

}
