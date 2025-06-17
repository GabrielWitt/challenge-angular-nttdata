import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, debounceTime, map, switchMap, take } from 'rxjs/operators';
import { AlertModalComponent } from "../../../shared/alert-modal/alert-modal.component";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AlertModalComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  isSubmitting = false;
  private subscriptions = new Subscription();
  showSuccessAlert: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
    this.listenToReleaseDate();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      id: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        [this.idValidator()]
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.releaseDateValidator]],
      date_revision: [{ value: '', disabled: true }, Validators.required]
    });
  }

private checkEditMode(): void {
  const idParam = this.route.snapshot.paramMap.get('id');
  if (idParam) {
    this.isEditMode = true;
    this.productId = idParam;

    // ID
    const idControl = this.productForm.get('id');
    if (idControl) {
      idControl.disable({ emitEvent: false });
      idControl.clearValidators();
      idControl.clearAsyncValidators();
      idControl.updateValueAndValidity({ emitEvent: false });
    }

    // date_revision
    const revisionControl = this.productForm.get('date_revision');
    if (revisionControl) {
      revisionControl.disable({ emitEvent: false });
      revisionControl.clearValidators();
      revisionControl.updateValueAndValidity({ emitEvent: false });
    }
    this.loadProduct(this.productId);
  }
}

  private loadProduct(id: string): void {
    this.productService.getById(id).subscribe(product => {
      this.productForm.patchValue({
        ...product,
        date_release: this.formatDate(product?.date_release ?? ''),
        date_revision: this.formatDate(product?.date_revision ?? '')
      });
      
      // 🔁 Forzar validación después de cargar datos
      Object.keys(this.productForm.controls).forEach(field => {
        const control = this.productForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });

      Object.keys(this.productForm.controls).forEach(field => {
        const control = this.productForm.get(field);
        control?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      });
    });
  }

  private listenToReleaseDate(): void {
    const control = this.productForm.get('date_release');
    if (!control) return;

    const sub = control.valueChanges.subscribe(value => {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        date.setFullYear(date.getFullYear() + 1);
        this.productForm.get('date_revision')?.setValue(this.formatDate(date));
      }
    });

    this.subscriptions.add(sub);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const product: Product = this.productForm.getRawValue();

    if (this.isEditMode) {
      this.updateProduct(product);
    } else {
      this.createProduct(product);
    }
  }

  private createProduct(product: Product): void {
    this.productService.create(product).subscribe({
      next: () => {
        this.router.navigate(['/']);
        this.isSubmitting = false;
      },
      error: () => (this.isSubmitting = false),
    });
  }

  private updateProduct(product: Product): void {
    if (!this.productId) return;
    this.productService.update(this.productId, product).subscribe({
        next: () => {
          this.showSuccessAlert = true;
          this.isSubmitting = false;
        },
        error: () => (this.isSubmitting = false),
      });
  }

  onReset(): void {
    this.productForm.reset();
  }

  private releaseDateValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(control.value);

    if (date < today) {
      return { invalidDate: 'La fecha debe ser igual o mayor a la actual.' };
    }

    return null;
  }

  private idValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(500),
        switchMap(id =>
          this.productService.verifyId(id).pipe(
            map(exists => (exists ? { idExists: 'ID no válido!' } : null)),
            catchError(() => of(null))
          )
        ),
        take(1)
      );
    };
  }

  isInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.hasError('required')) return 'Este campo es requerido.';
    if (field?.hasError('minlength')) return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres.`;
    if (field?.hasError('maxlength')) return `Máximo ${field.errors?.['maxlength'].requiredLength} caracteres.`;
    if (field?.hasError('idExists')) return 'ID no válido!';
    if (field?.hasError('invalidDate')) return field.errors?.['invalidDate'];
    return '';
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
