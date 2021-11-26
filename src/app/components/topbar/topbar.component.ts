import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';

import { NavbarService } from 'src/app/services/navbar.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Input() productPage: boolean = false;
  @Output() searchEvent = new EventEmitter<string[]>();

  public icons = [faBars, faSearch];
  public data: any;
  public initials: string = '';
  public userName: string = '';

  constructor(private navbarService: NavbarService,
              private router: Router,
              private productService: ProductService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.fillInitials();
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
    this.data = null;
    if (this.productPage) {
      this.router.navigate(['/products']);
    } else {
      this.router.navigate(['/sales']);
    }
  }

  fillInitials(): void {
    this.userName = this.userService.user.username;
    if (this.userService.user.name === undefined || this.userService.user.lastname === undefined) {
      this.initials = this.userService.user.username.charAt(0).toUpperCase() + this.userService.user.username.charAt(1).toUpperCase();
    } else {
      this.initials = this.userService.user.name.charAt(0).toUpperCase() + this.userService.user.lastname.charAt(0).toUpperCase();
    }
  }

}
