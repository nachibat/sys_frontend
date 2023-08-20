import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCalculator, faSave, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.css']
})
export class FormProductComponent implements OnInit {

  @Output() reloadEvent = new EventEmitter<boolean>();

  public validate = {
    code: false,
    desc: false,
    quan: false,
    cost: false,
    incr: false,
    iva: false,
    prof: false,
    pric: false
  };

  public disBtn = false;
  public icons = [faCalculator, faSave, faTimes, faSyncAlt];
  public formProduct: FormGroup;
  public subtotal = 0;

  constructor(public productService: ProductService,
              private formBuilder: FormBuilder,
              private modal: ElementRef,
              private container: ElementRef,
              private toastService: ToastrService) {
    
    this.formProduct = this.formBuilder.group({
      barcode: [{ value: '', disabled: false }, Validators.required],
      description: [{ value: '', disabled: false }, Validators.required],
      category: [{ value: 'kiosko', disabled: false }, Validators.required],
      quantity: [{ value: null, disabled: false }, Validators.required],
      cost_price: [{ value: null, disabled: false }],
      percent_increase: [{ value: null, disabled: false }],
      iva: [{ value: 21, disabled: false }, Validators.required],
      percent_profit: [{ value: null, disabled: false }],
      price: [{ value: null, disabled: false }, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.productService.edit) {
      this.loadData();
    }
  }

  public closeModal(): void {
    const myModal = this.modal.nativeElement.querySelector("#modal");
    const myContainer = this.container.nativeElement.querySelector('#container');
    myModal.classList.remove('fadeIn');
    myModal.classList.add('fadeOut');
    myContainer.classList.remove('slideIn');
    myContainer.classList.add('slideOut');
    setTimeout(() => {
      this.productService.openForm = false;
      this.productService.edit = false;
    }, 450);    
  }

  public calculatePrice(): void {
    const cost = this.formProduct.controls.cost_price.value;
    const subt = this.subtotal;
    const per_profit = this.formProduct.controls.percent_profit.value;
    if ( cost === null) {
      this.validate.cost = true;
      return;
    }
    if (subt === null) {
      this.validate.iva = true;
      return;
    }
    if (per_profit === null) {
      this.validate.prof = true;
      return;
    }
    const profit = (subt * per_profit) / 100;
    this.validate.pric = false;
    this.formProduct.controls.price.setValue(subt + profit);
  }

  private cleanForm(): void {
    this.formProduct.controls.barcode.setValue(null);
    this.formProduct.controls.description.setValue(null);
    this.formProduct.controls.category.setValue('kiosko');
    this.formProduct.controls.quantity.setValue(null);
    this.formProduct.controls.cost_price.setValue(null);
    this.formProduct.controls.percent_increase.setValue(null);
    this.formProduct.controls.iva.setValue(null);
    this.formProduct.controls.percent_profit.setValue(null);
    this.formProduct.controls.price.setValue(null);
  }

  private enabledInputs(): void {
    this.disBtn = false;
    this.formProduct.controls.barcode.enable();
    this.formProduct.controls.description.enable();
    this.formProduct.controls.category.enable();
    this.formProduct.controls.quantity.enable();
    this.formProduct.controls.cost_price.enable();
    this.formProduct.controls.percent_increase.enable();
    this.formProduct.controls.iva.enable();
    this.formProduct.controls.percent_profit.enable();
    this.formProduct.controls.price.enable();
  }

  private disabledInputs(): void {
    this.disBtn = true;
    this.formProduct.controls.barcode.disable();
    this.formProduct.controls.description.disable();
    this.formProduct.controls.category.disable();
    this.formProduct.controls.quantity.disable();
    this.formProduct.controls.cost_price.disable();
    this.formProduct.controls.percent_increase.disable();
    this.formProduct.controls.iva.disable();
    this.formProduct.controls.percent_profit.disable();
    this.formProduct.controls.price.disable();
  }

  public formSubmit(): void {
    if (!this.formProduct.valid) {
      if (this.formProduct.controls.barcode.errors) { this.validate.code = true; }
      if (this.formProduct.controls.description.errors) { this.validate.desc = true; }
      if (this.formProduct.controls.quantity.errors) { this.validate.quan = true; }
      if (this.formProduct.controls.iva.errors) { this.validate.iva = true; }
      if (this.formProduct.controls.price.errors) { this.validate.pric = true; }
      return;
    }
    this.disabledInputs();
    this.productService.loading = true;
    if (this.productService.edit) {
      this.productService.modifyProduct(this.productService.product._id, this.formProduct.value).subscribe(resp => {
        this.productService.product = resp.productModified;
        this.success();
        this.reloadEvent.emit(true);
      }, err => {
        this.handleError(err);
      });
    } else {
      this.productService.createProduct(this.formProduct.value).subscribe(resp => {
        this.success();
        this.reloadEvent.emit(false);
      }, err => {            
        this.handleError(err);
      });
    }
  }

  loadData(): void {
    this.formProduct.reset();
    this.formProduct.controls['barcode'].setValue(this.productService.product.barcode);
    this.formProduct.controls['description'].setValue(this.productService.product.description);
    this.formProduct.controls['category'].setValue(this.productService.product.category);
    this.formProduct.controls['quantity'].setValue(this.productService.product.quantity);
    this.formProduct.controls['cost_price'].setValue(this.productService.product.cost_price);
    this.formProduct.controls['percent_increase'].setValue(this.productService.product.percent_increase);
    this.formProduct.controls['iva'].setValue(this.productService.product.iva ? this.productService.product.iva : 21);
    this.formProduct.controls['percent_profit'].setValue(this.productService.product.percent_profit);
    this.formProduct.controls['price'].setValue(this.productService.product.price);
    // this.subtotal = this.formProduct.controls['cost_price'].value + (this.formProduct.controls['cost_price'].value * this.formProduct.controls['iva'].value / 100);
    this.calcSubtotal();
  }

  success(): void {
    if (this.productService.edit) {
      this.toastService.success('Producto modificado correctamente', 'Información');
    } else {
      this.toastService.success('Producto agregado correctamente', 'Información');
    }
    this.productService.loading = false;
    this.productService.edit = false;
    this.cleanForm();
    this.enabledInputs();
    this.closeModal();    
  }

  handleError(err: any): void {
    this.productService.loading = false;
    this.enabledInputs();
    if (err.status === 401) {
      this.toastService.error('Problemas de autorizacion. Cerrar sesión y volver a iniciar!', 'Error!', { timeOut: 7000 });
      console.log(err.error);
    } 
    if (err.status === 400) {
      if (err.error.detail.errors.barcode.message === 'barcode must be unique') {
        this.toastService.error('Código de barra repetido', 'Error!', { timeOut: 7000 });
        console.log(err.error);
      }
    } else {
      if (err.status === 403) {
        this.toastService.error('Problemas de autorizacion. El usuario no tiene permisos!', 'Error!', { timeOut: 7000 });
        console.log(err.error);
      } else {
        this.toastService.error('Problemas con el servidor', 'Error!', { timeOut: 7000 });
        console.log(err);
      }
    }
  }

  calcSubtotal() {
    // this.subtotal = this.formProduct.controls['cost_price'].value + (this.formProduct.controls['cost_price'].value * this.formProduct.controls['iva'].value / 100);
    const cost_price = this.formProduct.controls['cost_price'].value;
    const increase = this.formProduct.controls['percent_increase'].value;
    const iva = this.formProduct.controls['iva'].value;
    const increaseSubtotal = cost_price + (cost_price * increase / 100);
    this.subtotal = Math.round(increaseSubtotal + (increaseSubtotal * iva / 100));
  }

}
