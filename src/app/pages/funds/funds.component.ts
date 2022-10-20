import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Fund } from 'src/app/interfaces/fund.response';
import { FundsService } from 'src/app/services/funds.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-funds',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.css']
})
export class FundsComponent implements OnInit {

  public isOpen: boolean = false;
  public icons = [faSearch];
  public dateFrom: string = new Date().toISOString().slice(0, 10);
  public dateTo: string = new Date().toISOString().slice(0, 10);
  public loading: boolean = false;
  public fundRegister: Fund[] = [];
  public totalFunds = 0;
  public formFundRegister: FormGroup;
  public validate = { expense: false, description: false };
  public disabledButton = false;
  public openModal = false;

  constructor(private navbarService: NavbarService,
              private fundService: FundsService,
              private formBuilder: FormBuilder,
              private modal: ElementRef,
              private container: ElementRef,
              private toastService: ToastrService) {
    this.formFundRegister = this.formBuilder.group({
      expenses: [{ value: 0, disabled: false }, Validators.required],
      description: [{ value: '', disabled: false }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => this.isOpen = resp);
    this.getFirstDay();
    this.search();
    this.getTotalFund();
  }

  private getFirstDay(): void {
    const today = new Date;
    this.dateFrom = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  }

  search(): void {
    this.loading = true;
    this.fundService.fundListRange(this.dateFrom, this.dateTo).subscribe(resp => {
      this.fundRegister = resp.listFunds;
      this.loading = false;
    }, err => {
      this.handleError(err);
      this.loading = false;
    });
  }

  getTotalFund() {
    this.fundService.getLastone().subscribe(resp => this.totalFunds = resp.lastone.total);
  }

  private handleError(err: any): void {
    this.enabledForm();
    if (err.status === 401) {
      this.toastService.error('Problemas de autorizacion. Cerrar sesión y volver a iniciar!', 'Error!', { timeOut: 7000 });
      console.error(err.error);
    }
    if (err.status === 403) {
      this.toastService.error('Problemas de autorizacion. El usuario no tiene permisos!', 'Error!', { timeOut: 7000 });
      console.error(err.error);
    } else {
      this.toastService.error('Problemas con el servidor', 'Error!', { timeOut: 7000 });
      console.error(err);
    }
  }

  private cleanForm(): void {
    this.formFundRegister.controls.expenses.setValue(null);
    this.formFundRegister.controls.description.setValue(null);
  }

  private disabledForm(): void {
    this.formFundRegister.controls.expenses.disable();
    this.formFundRegister.controls.description.disable();
    this.disabledButton = true;
  }

  private enabledForm(): void {
    this.formFundRegister.controls.expenses.enable();
    this.formFundRegister.controls.description.enable();
    this.disabledButton = false;
  }

  openModalWithData() {
    this.cleanForm();
    this.openModal = true;
  }

  public closeModal(): void {
    const myModal = this.modal.nativeElement.querySelector('#modal');
    const myContainer = this.container.nativeElement.querySelector('#container');
    myModal.classList.remove('fadeIn');
    myModal.classList.add('fadeOut');
    myContainer.classList.remove('slideIn');
    myContainer.classList.add('slideOut');
    setTimeout(() => {
      this.openModal = false;
    }, 450);
  }

  registerExpense() {
    if (!this.formFundRegister.valid) {
      if (this.formFundRegister.controls.expenses.errors) this.validate.expense = true;
      if (this.formFundRegister.controls.description.errors) this.validate.description = true;
      return;
    }
    this.disabledForm();
    this.fundService.createFund(this.formFundRegister.value).subscribe(resp => {
      this.success('Se registró gasto correctamente');
    }, err => this.handleError(err));
  }

  private success(msg: string): void {
    this.toastService.success(msg, 'Informacion');
    this.enabledForm();
    this.closeModal();
    this.search();
    this.getTotalFund();
  }

}
