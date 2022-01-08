import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faAt, faEllipsisV, faIdCard, faMapMarked, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from 'src/app/interfaces/supplier.response';
import { ModalService } from 'src/app/services/modal.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  public isOpen: boolean = false;
  public icons = [faIdCard, faMapMarked, faPhoneAlt, faAt, faEllipsisV];
  public header: string = '';
  public openModal: boolean = false;
  public disabledButton: boolean = false;
  public suppliers: Supplier[] = [];
  public formSupplier: FormGroup;
  public validate = { name: false, address: false, phone: false };
  public supplier!: Supplier;
  public loading: boolean = false;

  private edit: boolean = false;

  constructor(private navbarService: NavbarService,
              private modal: ElementRef,
              private container: ElementRef,
              private supplierService: SupplierService,
              private formBuilder: FormBuilder,
              private toastService: ToastrService,
              private modalService: ModalService) {

    this.formSupplier = this.formBuilder.group({
      name: [{ value: '', disabled: false }, Validators.required],
      address: [{ value: '', disabled: false }, Validators.required],
      phone: [{ value: null, disabled: false }, Validators.required],
      mail: [{ value: '', disabled: false }],
    });
  }

  ngOnInit(): void {
    this.isOpen = this.navbarService.isOpen;
    this.navbarService.change.subscribe(resp => {
      this.isOpen = resp;
    });
    this.loadSuppliers();
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
      this.cleanForm();
    }, 450);
  }

  public openAddModal(): void {
    this.edit = false;
    this.header = 'Agregar';
    this.openModal = true;
  }

  public openEditModal(supplier: Supplier): void {
    this.supplier = supplier;
    this.loadFormData();
    this.edit = true;
    this.header = 'Editar';
    this.openModal = true;
  }

  public confirmModal(): void {
    if (this.edit) {
      this.editSupplier();
    } else {
      this.addSupplier();
    }
  }

  public remove(id: string): void {
    this.modalService.confirmationModal = true;
    this.modalService.confirmButton = true;
    this.modalService.title = 'Confirmación';
    this.modalService.message = '¿Está seguro que desea eliminar el proveedor?';
    this.modalService.execCallback(() => {
      this.supplierService.deleteSupplier(id).subscribe(resp => {
        console.log(resp);
        this.toastService.success('Se eliminó el proveedor correctamente', 'Información');
        this.loadSuppliers();
      }, err => {
        this.handleError(err);
      });
    });
  }

  private addSupplier(): void {
    if (!this.formSupplier.valid) {
      if (this.formSupplier.controls.name.errors) { this.validate.name = true; }
      if (this.formSupplier.controls.address.errors) { this.validate.address = true; }
      if (this.formSupplier.controls.phone.errors) { this.validate.phone = true; }
      return;
    }
    this.disabledForm();
    this.supplierService.createSupplier(this.formSupplier.value).subscribe(resp => {
      this.success();
    }, err => {
      this.handleError(err);
    });
  }

  private editSupplier(): void {
    if (!this.formSupplier.valid) {
      if (this.formSupplier.controls.name.errors) { this.validate.name = true; }
      if (this.formSupplier.controls.address.errors) { this.validate.address = true; }
      if (this.formSupplier.controls.phone.errors) { this.validate.phone = true; }
      return;
    }
    this.disabledForm();
    this.supplierService.modifySupplier(this.supplier._id, this.formSupplier.value).subscribe(resp => {
      this.success();
    }, err => {
      this.handleError(err);
    });
  }

  private loadSuppliers(): void {
    this.loading = true;
    this.supplierService.getSupplierList().subscribe(resp => {
      this.suppliers = resp.listSuppliers;
      this.loading = false;
    });
  }

  private success(): void {
    if (this.edit) {
      this.toastService.success('Proveedor modificado correctamente', 'Información');
    } else {
      this.toastService.success('Proveedor agregado correctamente', 'Información');
    }
    this.enabledForm();
    this.closeModal();
    this.loadSuppliers();
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
    this.formSupplier.controls.name.setValue(null);
    this.formSupplier.controls.address.setValue(null);
    this.formSupplier.controls.phone.setValue(null);
    this.formSupplier.controls.mail.setValue(null);
    this.validate = { name: false, address: false, phone: false };
  }

  private enabledForm(): void {
    this.disabledButton = false;
    this.formSupplier.controls.name.enable();
    this.formSupplier.controls.address.enable();
    this.formSupplier.controls.phone.enable();
    this.formSupplier.controls.mail.enable();
  }

  private disabledForm(): void {
    this.disabledButton = true;
    this.formSupplier.controls.name.disable();
    this.formSupplier.controls.address.disable();
    this.formSupplier.controls.phone.disable();
    this.formSupplier.controls.mail.disable();
  }

  private loadFormData(): void {
    this.formSupplier.reset();
    this.formSupplier.controls['name'].setValue(this.supplier.name);
    this.formSupplier.controls['address'].setValue(this.supplier.address);
    this.formSupplier.controls['phone'].setValue(this.supplier.phone);
    this.formSupplier.controls['mail'].setValue(this.supplier.mail);
  }

}
