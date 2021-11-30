import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faKey, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
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
  public formProduct: FormGroup;

  constructor(private navbarService: NavbarService,
              private userService: UserService,
              private modal: ElementRef,
              private container: ElementRef,
              private formBuilder: FormBuilder,
              private toastService: ToastrService) {
    this.formProduct = this.formBuilder.group({
      name: [{ value: '', disabled: false }],
      lastname: [{ value: '', disabled: false }],
      email: [{ value: '', disabled: false }],
    });
  }

  ngOnInit(): void {
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => {
      this.isOpen = resp;
    });
    this.loading = true;
    this.user = this.userService.user;
    this.formProduct.controls['name'].setValue(this.user.name);
    this.formProduct.controls['lastname'].setValue(this.user.lastname);
    this.formProduct.controls['email'].setValue(this.user.email);
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
    this.loading = true
    this.userService.modifyUser(this.user._id, this.formProduct.value).subscribe(resp => {
      this.userService.user = resp.userModified;
      this.user = this.userService.user;
      this.toastService.success('Usuario modificado correctamente', 'Información');
      this.closeModal('#modalEdit', '#containerEdit');
      this.loading = false;
    }, err => {
      this.toastService.error('Problemas con el servidor', 'Error!', { timeOut: 7000 });
      console.log(err);
    });
  }

  changePass(): void {
    console.log('cambiar pass');
  }

}
