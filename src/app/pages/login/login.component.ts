import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faLock, faSignInAlt, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public validate = {
    user: false,
    pass: false,
    len: false
  };

  public btnLogin = false;
  public icons = [faUser, faLock, faSignInAlt, faEye];
  public formLogin: FormGroup;
  public showPassword = false;

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private userService: UserService,
              private router: Router) {
    this.formLogin = this.formBuilder.group({
      username: [{value: '', disabled: false}, Validators.required],
      password: [{value: '', disabled: false}, [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
  }

  enabledInputs() {
    this.btnLogin = false;
    this.formLogin.controls['username'].enable();
    this.formLogin.controls['password'].enable();
  }

  disabledInputs() {
    this.btnLogin = true;
    this.formLogin.controls['username'].disable();
    this.formLogin.controls['password'].disable();
  }

  cleanError(): void {
    this.validate = {
      user: false,
      pass: false,
      len: false
    };
  }

  login(): void {  
    if (!this.formLogin.valid) {
      if (this.formLogin.controls.username.errors) { this.validate.user = true; }
      if (this.formLogin.controls.password.errors) {
        if (this.formLogin.controls.password.errors!.required) {
          this.validate.pass = true;
        } else {
          this.validate.len = true;
        }
      }
      return;
    }
    this.disabledInputs();
    this.userService.login(this.formLogin.value.username, this.formLogin.value.password).subscribe((resp) => {
      localStorage.setItem('token', resp.token);
      this.router.navigate(['/home']);
    }, (err) => {
      if (err.status === 401) {
        this.toastrService.error('Usuario o contraseña incorrecto', 'Error');
      } else {
        this.toastrService.error('Problemas con el servidor', 'Error');
        console.log(err.error);
      }
      this.enabledInputs();
    });
  }

  togglePass() {
    if (this.icons[3] === faEye) {
      this.showPassword = true;
      this.icons[3] = faEyeSlash;
    } else {
      this.showPassword = false;
      this.icons[3] = faEye;
    }
  }

}
