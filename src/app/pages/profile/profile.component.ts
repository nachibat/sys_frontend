import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faEye, faEyeSlash, faKey, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
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
  public icons = [faSave, faTimes, faKey, faEye, faEye, faEye];
  public loading: boolean = false;
  public user!: User;
  public modalEdit: boolean = false;
  public modalPass: boolean = false;
  public formProduct: FormGroup;
  public formPass: FormGroup;

  public required = false;
  public validatedLength = false;
  public badlogin = false;
  public different = false;
  public validatedError = {
    pass: false,
    newpass: false,
    retrypass: false
  };
  public showPassword = [false, false, false];

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
    this.formPass = this.formBuilder.group({
      pass: [{ value: '', disabled: false }, Validators.required],
      newpass: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(6)]],
      retrypass: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(6)]]
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

  cleanError(): void {
    this.required = false
    this.validatedLength = false;
    this.badlogin = false;
    this.different = false;
    this.validatedError = {
      pass: false,
      newpass: false,
      retrypass: false
    };
  }

  changePass(): void {
    if (!this.formPass.valid) {
      if (this.formPass.controls.pass.errors) {
        this.required = true;
        this.validatedError.pass = true;
      }
      if (this.formPass.controls.newpass.errors) {
        this.validatedError.newpass = true;
        if (this.formPass.controls.newpass.errors.required) {
          this.required = true;
        } else {
          this.validatedLength = true;
        }
      }
      if (this.formPass.controls.retrypass.errors) {
        this.validatedError.retrypass = true;
        if (this.formPass.controls.retrypass.errors.required) {
          this.required = true;
        } else {
          this.validatedLength = true;
        }
      }
      return;
    }
    if (this.formPass.value.newpass != this.formPass.value.retrypass) {
      this.different = true;
      return;
    }
    this.userService.changePassword(this.user.username, this.formPass.value.pass, this.formPass.value.newpass).subscribe(resp => {
      this.toastService.success('Usuario modificado correctamente', 'Información');
      this.closeModal('#modalPass', '#containerPass');
    }, err => {
      if (err.status === 401) {
        this.badlogin = true;
      } else {
        this.toastService.error('Problemas con el servidor', 'Error!', { timeOut: 7000 });
        console.log(err);
      }
    });
    this.cleanError();
  }

  togglePass(data: number) {
    const pos = data + 2;
    if (this.icons[pos] === faEye) {
      this.showPassword[data - 1] = true;
      this.icons[pos] = faEyeSlash;
    } else {
      this.showPassword[data - 1] = false;
      this.icons[pos] = faEye;
    }
  }

}
