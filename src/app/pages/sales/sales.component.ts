import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faPlus, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  isOpen: boolean = false;
  public icons = [faPlus, faTimes, faChevronLeft, faSearch];

  constructor(private navbarService: NavbarService) { }

  ngOnInit(): void {
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => {
      this.isOpen = resp;
    });
  }

}
