import { Component, OnInit } from '@angular/core';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';

import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  icons = [faBars, faSearch];

  constructor(private navbarService: NavbarService) { }

  ngOnInit(): void {
  }

  toggleNavbar() {
    this.navbarService.toggle();
  }

}
