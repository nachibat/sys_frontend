import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faBookOpen, faHome, faArchive, faMoneyBillAlt, faClipboardList, faUserAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  icons = [faBookOpen, faHome, faArchive, faMoneyBillAlt, faClipboardList, faUserAlt, faSignOutAlt];
  isOpen: boolean = false;

  constructor(private navbarService: NavbarService,
              private router: Router) { }

  ngOnInit(): void {
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => {
      this.isOpen = resp;
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
