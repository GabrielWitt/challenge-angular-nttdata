import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../../core/services/product.service';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(waitForAsync(() => {
    // Mocks de dependencias
    productServiceMock = {
      verifyId: jest.fn(() => of(false)), // Mock de validación asíncrona del ID
      getById: jest.fn(),                 // Mock de obtener producto por ID
      create: jest.fn(() => of({})),      // Mock de creación de producto
      update: jest.fn(() => of({}))       // Mock de actualización de producto
    };

    routerMock = {
      navigate: jest.fn()                 // Mock de navegación del router
    };

    // Mock de ruta sin parámetro 'id' (modo creación)
    activatedRouteMock = {
      snapshot: { paramMap: { get: jest.fn(() => null) } }
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProductFormComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se crea correctamente
  });

  it('debería marcar el formulario como inválido si está vacío', () => {
    expect(component.productForm.valid).toBeFalsy(); // Verifica formulario inválido si no se llena
  });

  it('debería marcar error si la fecha de liberación es menor a la actual', () => {
    const control = component.productForm.get('date_release');
    control?.setValue('2000-01-01'); // Fecha pasada
    expect(control?.valid).toBeFalsy(); // Espera error de validación
    expect(control?.errors?.['invalidDate']).toBeDefined(); // Confirma el tipo de error
  });

  it('debería marcar todos los campos como tocados si se envía formulario inválido', () => {
    const spy = jest.spyOn(component.productForm, 'markAllAsTouched');
    component.onSubmit(); // Envía el formulario sin llenar
    expect(spy).toHaveBeenCalled(); // Confirma que se marcaron los campos
  });

  it('debería llamar a create() cuando el formulario es válido en modo creación', () => {
    // Rellena todos los campos válidamente
    component.productForm.setValue({
      id: 'ABC123',
      name: 'Producto de prueba',
      description: 'Una descripción válida y larga',
      logo: 'https://example.com/logo.png',
      date_release: '2100-01-01',
      date_revision: '2101-01-01'
    });

    component.onSubmit(); // Envía el formulario

    expect(productServiceMock.create).toHaveBeenCalled(); // Verifica que se llamó a create()
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']); // Verifica redirección al home
  });

  it('debería cargar datos del producto en modo edición', () => {
    // Simula el modo edición con ID
    const productoMock = {
      id: 'XYZ',
      name: 'Nombre',
      description: 'Desc',
      logo: 'https://logo.com',
      date_release: '2100-01-01',
      date_revision: '2101-01-01'
    };

    activatedRouteMock.snapshot.paramMap.get = jest.fn(() => 'XYZ');
    productServiceMock.getById = jest.fn(() => of(productoMock));

    // Se crea un nuevo componente con el nuevo mock de ActivatedRoute
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Espera que el formulario tenga los datos del producto
    expect(component.productForm.get('name')?.value).toBe(productoMock.name);
    expect(component.productForm.get('description')?.value).toBe(productoMock.description);
  });

  it('debería llamar a update() si está en modo edición y el formulario es válido', () => {
    // Simula modo edición
    component.isEditMode = true;
    component.productId = 'ABC123';

    component.productForm.setValue({
      id: 'ABC123',
      name: 'Producto Actualizado',
      description: 'Descripción actualizada válida',
      logo: 'https://logo.com',
      date_release: '2100-01-01',
      date_revision: '2101-01-01'
    });

    component.onSubmit(); // Envía el formulario
    expect(productServiceMock.update).toHaveBeenCalledWith('ABC123', component.productForm.getRawValue()); // Verifica llamada a update
    expect(component.showSuccessAlert).toBeTruthy(); // Muestra alerta de éxito
  });
});
