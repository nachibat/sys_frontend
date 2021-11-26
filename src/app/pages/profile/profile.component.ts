import { Component, ElementRef, OnInit } from '@angular/core';
import { faKey, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/interfaces/user.response';
import { NavbarService } from 'src/app/services/navbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isOpen: boolean = false;
  public icons = [faSave, faTimes, faKey]
  public loading: boolean = false;
  public user!: User;
  public modalEdit: boolean = false;
  public modalPass: boolean = false;

  constructor(private navbarService: NavbarService,
              private userService: UserService,
              private modal: ElementRef,
              private container: ElementRef) { }

  ngOnInit(): void {
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => {
      this.isOpen = resp;
    });
    this.loading = true;
    this.user = this.userService.user;
    this.loading = false;
  }

  closeModal(modal: string, container: string): void {
    const myModal = this.modal.nativeElement.querySelector(modal);
    const myContainer = this.container.nativeElement.querySelector(container);
    myModal.classList.remove('fadeIn');
    myModal.classList.add('fadeOut');
    myContainer.classList.remove('slideIn');
    myContainer.classList.add('slideOut');
    setTimeout(() => {
      this.modalEdit = false;
      this.modalPass = false;
    }, 450);
  }

  editUser(): void {
    console.log('editar');
  }

  changePass(): void {
    console.log('cambiar pass');
  }

}
