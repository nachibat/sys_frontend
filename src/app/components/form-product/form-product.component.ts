import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCalculator, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.css']
})
export class FormProductComponent implements OnInit {

  public validate = {
    code: false,
    desc: false,
    quan: false,
    cost: false,
    prof: false,
    pric: false
  };

  public disBtn = false;
  public icons = [faCalculator, faSave, faTimes];
  public formProduct: FormGroup;

  constructor(private userService: UserService,
              private modal: ElementRef,
              private container: ElementRef,
              private formBuilder: FormBuilder) {
    this.formProduct = this.formBuilder.group({
      barcode: [{ value: '', disabled: false }, Validators.required],
      description: [{ value: '', disabled: false }, Validators.required],
      category: [{ value: 'kiosko', disabled: false }, Validators.required],
      quantity: [{ value: null, disabled: false }, Validators.required],
      cost_price: [{ value: null, disabled: false }],
      percent_profit: [{ value: null, disabled: false }],
      price: [{ value: null, disabled: false }, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  public openModal(): void {
    const myModal = this.modal.nativeElement.querySelector("#modal");
    const myContainer = this.container.nativeElement.querySelector('#container');
    myModal.classList.remove('closed');
    myModal.classList.add('opened');
    myModal.classList.add('fadeIn');    
    myContainer.classList.add('slideIn');
  }

  public closeModal(): void {
    const myModal = this.modal.nativeElement.querySelector("#modal");
    const myContainer = this.container.nativeElement.querySelector('#container');
    myModal.classList.remove('fadeIn');
    myModal.classList.add('fadeOut');
    myContainer.classList.remove('slideIn');
    myContainer.classList.add('slideOut');
    setTimeout(() => {
      myModal.classList.remove('opened');
      myModal.classList.remove('fadeOut');
      myModal.classList.add('closed');
      myContainer.classList.remove('slideOut');
    }, 450);
  }

  public calculatePrice(): void {
    const cost = this.formProduct.controls.cost_price.value;
    const per_profit = this.formProduct.controls.percent_profit.value;
    if ( cost === null) {
      this.validate.cost = true;
      return;
    }
    if (per_profit === null) {
      this.validate.prof = true;
      return;
    }
    const profit = (cost * per_profit) / 100;
    this.formProduct.controls.price.setValue(cost + profit);
  }

  private cleanForm(): void {
    this.formProduct.controls.barcode.setValue(null);
    this.formProduct.controls.description.setValue(null);
    this.formProduct.controls.category.setValue('kiosko');
    this.formProduct.controls.quantity.setValue(null);
    this.formProduct.controls.cost_price.setValue(null);
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
    this.formProduct.controls.percent_profit.disable();
    this.formProduct.controls.price.disable();
  }

  public formSubmit(): void {
    if (!this.formProduct.valid) {
      if (this.formProduct.controls.barcode.errors) { this.validate.code = true; }
      if (this.formProduct.controls.description.errors) { this.validate.desc = true; }
      if (this.formProduct.controls.quantity.errors) { this.validate.quan = true; }
      if (this.formProduct.controls.price.errors) { this.validate.pric = true; }
      return;
    }
    this.disabledInputs();
    setTimeout(() => {
      console.log(this.formProduct.value);
      this.cleanForm();
      this.enabledInputs();
      this.closeModal();
    }, 1500);
  }

}
