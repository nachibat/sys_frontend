import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';

import { NavbarService } from 'src/app/services/navbar.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Output() searchEvent = new EventEmitter<string[]>();

  public icons = [faBars, faSearch];
  public data: any;

  constructor(private navbarService: NavbarService,
              private router: Router,
              private productService: ProductService) { }

  ngOnInit(): void {
  }

  toggleNavbar() {
    this.navbarService.toggle();
  }

  search(): void {
    if (this.data === undefined || this.data.trim() === '') { return; }    
    if (!isNaN(parseFloat(this.data)) && !isNaN(this.data - 0)) {
      this.productService.paramsSearch = ['barcode', this.data.trim()];
      this.searchEvent.emit(['barcode', this.data.trim()]);
    } else {
      this.productService.paramsSearch = ['description', this.data.trim()];
      this.searchEvent.emit(['description', this.data.trim()]);
    }
    this.productService.search = true;
    this.router.navigate(['/products']);
  }

}
