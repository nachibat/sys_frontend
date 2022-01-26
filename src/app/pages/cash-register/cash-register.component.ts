import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Cash } from 'src/app/interfaces/cash.response';
import { CashService } from 'src/app/services/cash.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { SaleService } from 'src/app/services/sale.service';

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.component.html',
  styleUrls: ['./cash-register.component.css']
})
export class CashRegisterComponent implements OnInit {

  public isOpen: boolean = false;
  public icons = [faChevronLeft, faChevronRight, faSearch];
  public dateFrom: string = new Date().toISOString().slice(0,10);
  public dateTo: string = new Date().toISOString().slice(0,10);
  public openModal: boolean = false;
  public formCashRegister: FormGroup;
  public validate = { cash: false, ivc: false, uvc: false, avc: false, kiosk: false, tksi: false, expenses: false, cigarettes: false, withdrawals: false };
  public disabledButton: boolean = false;
  public cashRegister: Cash[] = [];
  public loading: boolean = false;

  private lastCashEarnings: number = 0;
  private todayCashEarnings: number = 0;
  private todayCigarettes: number = 0;

  constructor(private navbarService: NavbarService,
              private modal: ElementRef,
              private container: ElementRef,
              private formBuilder: FormBuilder,
              private saleService: SaleService,
              private cashService: CashService,
              private toastService: ToastrService) {

    this.formCashRegister = this.formBuilder.group({
      cash: [{ value: 0, disabled: true }, Validators.required],
      ivc: [{ value: null, disabled: false }, Validators.required],
      uvc: [{ value: null, disabled: false }, Validators.required],
      avc: [{ value: null, disabled: false }, Validators.required],
      kiosk: [{ value: 0, disabled: true }, Validators.required],
      tksi: [{ value: null, disabled: false }, Validators.required],
      expenses: [{ value: null, disabled: false }, Validators.required],
      cigarettes: [{ value: null, disabled: true }, Validators.required],
      withdrawals: [{ value: null, disabled: false }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => {
      this.isOpen = resp;
    });
    this.getFirstDay();
    this.search();
  }

  private getFirstDay(): void {
    const today = new Date;
    this.dateFrom = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  }

  public stateInput(check: boolean, input: string) {    
    if (check) {
      this.formCashRegister.get(input)?.enable();
    } else {
      this.formCashRegister.get(input)?.disable();
    }
  }

  public async openModalWithData() {
    this.cleanForm();
    this.openModal = true
    await this.getLastCashEarnings();
    await this.getTodayCashEarnings();
    await this.getTodayCigarettes();
    this.formCashRegister.controls.cash.setValue(this.lastCashEarnings);
    this.formCashRegister.controls.kiosk.setValue(this.todayCashEarnings);
    this.formCashRegister.controls.cigarettes.setValue(this.todayCigarettes);
  }

  private async getLastCashEarnings() {
    this.lastCashEarnings = 0;
    let lastDate = new Date();
    lastDate.setDate(lastDate.getDate() - 1);
    let date = lastDate.toISOString().slice(0, 10);
    let stop = 3;
    while (stop > 0) {
      stop -= 1;
      const resp = await this.cashService.cashListRangePromise(date, date);
      if (resp.total > 0) {
        const cash = resp.listCashes[resp.listCashes.length - 1];
        this.lastCashEarnings = (cash.cash + (cash.ivc - cash.uvc) + cash.avc + cash.kiosk + cash.tksi) - (cash.expenses + cash.cigarettes + cash.withdrawals);
        stop = 0;
      } else {
        lastDate.setDate(lastDate.getDate() - 1);
        date = lastDate.toISOString().slice(0, 10);
      }
    }
  }

  private async getTodayCashEarnings() {
    this.todayCashEarnings = 0;
    const resp = await this.saleService.saleListPromise();
    for (let i = 0; i < resp.listSales.length; i++) {
      const element = resp.listSales[i];
      if (element.payment === 'CASH') {
        this.todayCashEarnings += element.total;
      }
    }
  }

  private async getTodayCigarettes() {
    this.todayCigarettes = 0;
    const today: string = new Date().toISOString().slice(0, 10);
    const resp = await this.saleService.saleListRange(today, today);
    const sales = resp.listSales;
    for (let i = 0; i < sales.length; i++) {
      const element = sales[i];
      const resp2 = this.saleService.itemSaleList(element._id);
      for (let j = 0; j < (await resp2).listItems.length; j++) {
        const element = (await resp2).listItems[j];
        if (element.product && element.product.description.toLowerCase().search('cigarrillo') >= 0) {
          this.todayCigarettes += element.quantity * element.price;
        }
      }
    }
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

  public addCashRegister(): void {
    if (!this.formCashRegister.valid) {
      if (this.formCashRegister.controls.cash.errors) { this.validate.cash = true; }
      if (this.formCashRegister.controls.ivc.errors) { this.validate.ivc = true; }
      if (this.formCashRegister.controls.uvc.errors) { this.validate.uvc = true; }
      if (this.formCashRegister.controls.avc.errors) { this.validate.avc = true; }
      if (this.formCashRegister.controls.kiosk.errors) { this.validate.kiosk = true; }
      if (this.formCashRegister.controls.tksi.errors) { this.validate.tksi = true; }
      if (this.formCashRegister.controls.expenses.errors) { this.validate.expenses = true; }
      if (this.formCashRegister.controls.cigarettes.errors) { this.validate.cigarettes = true; }
      if (this.formCashRegister.controls.withdrawals.errors) { this.validate.withdrawals = true; }
      return;
    }
    this.disabledForm();
    this.cashService.createCash(this.formCashRegister.value).subscribe(resp => {
      this.success('Se registró caja correctamente');
    }, err => {
      this.handleError(err);
    });
  }

  public search(): void {
    this.loading = true;
    this.cashService.cashListRange(this.dateFrom, this.dateTo).subscribe(resp => {
      this.cashRegister = resp.listCashes;
      this.loading = false;
    }, err => {
      this.handleError(err);
      this.loading = false;
    });
  }

  private cleanForm(): void {
    this.formCashRegister.controls.cash.setValue(null);
    this.formCashRegister.controls.ivc.setValue(null);
    this.formCashRegister.controls.uvc.setValue(null);
    this.formCashRegister.controls.avc.setValue(null);
    this.formCashRegister.controls.kiosk.setValue(null);
    this.formCashRegister.controls.tksi.setValue(null);
    this.formCashRegister.controls.expenses.setValue(null);
    this.formCashRegister.controls.cigarettes.setValue(null);
    this.formCashRegister.controls.withdrawals.setValue(null);
  }

  private disabledForm(): void {
    this.disabledButton = true;
    this.formCashRegister.controls.cash.disable();
    this.formCashRegister.controls.ivc.disable();
    this.formCashRegister.controls.uvc.disable();
    this.formCashRegister.controls.avc.disable();
    this.formCashRegister.controls.kiosk.disable();
    this.formCashRegister.controls.tksi.disable();
    this.formCashRegister.controls.expenses.disable();
    this.formCashRegister.controls.cigarettes.disable();
    this.formCashRegister.controls.withdrawals.disable();
  }

  private enabledForm(): void {
    this.disabledButton = false;
    this.formCashRegister.controls.ivc.enable();
    this.formCashRegister.controls.uvc.enable();
    this.formCashRegister.controls.avc.enable();
    this.formCashRegister.controls.tksi.enable();
    this.formCashRegister.controls.expenses.enable();
    this.formCashRegister.controls.withdrawals.enable();
  }

  private success(msg: string): void {
    this.toastService.success(msg, 'Información');
    this.enabledForm();
    this.closeModal();
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


}
