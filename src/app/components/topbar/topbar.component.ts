import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';

import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Output() searchEvent = new EventEmitter<string[]>();

  public icons = [faBars, faSearch];
  public data: any;

  constructor(private navbarService: NavbarService) { }

  ngOnInit(): void {
  }

  toggleNavbar() {
    this.navbarService.toggle();
  }

  search(): void {
    if (this.data === undefined || this.data.trim() === '') { return; }
    if (!isNaN(parseFloat(this.data)) && !isNaN(this.data - 0)) {
      this.searchEvent.emit(['barcode', this.data.trim()]);
    } else {
      this.searchEvent.emit(['description', this.data.trim()]);
    }
  }

}
