import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../core/models/product.model';

// Mocks
class MockProductService {
  getAll() {
    return of([]);
  }
  deleteById(id: number) {
    return of(null);
  }
}

class MockRouter {
  navigate = jest.fn();
  navigateByUrl = jest.fn();
}
describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;
  let router: Router;

beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init and update displayedProducts', fakeAsync(() => {
    const productsMock : Product[] = [
      { id: '1', name: 'Product A', description: 'Desc A', logo: 'null', date_release: new Date().toDateString(), date_revision: new Date().toDateString() },
      { id: '2', name: 'Product B', description: 'Desc B', logo: 'null', date_release: new Date().toDateString(), date_revision: new Date().toDateString() }
    ];
    jest.spyOn(productService, 'getAll').mockReturnValue(of(productsMock));

    component.ngOnInit();
    tick();

    expect(component.allProducts).toEqual(productsMock);
    expect(component.displayedProducts.length).toBeLessThanOrEqual(component.pageSize);
    expect(component.isLoading).toBe(false);
  }));

  it('should filter displayedProducts by searchTerm', () => {
    component.allProducts = [
      { id: '1', name: 'Apple', description: 'Red fruit', logo: 'null', date_release: new Date().toDateString(), date_revision: new Date().toDateString() },
      { id: '2', name: 'Banana', description: 'Yellow fruit', logo: 'null', date_release: new Date().toDateString(), date_revision: new Date().toDateString() }
    ];

    component.searchTerm = 'apple';
    component.pageSize = 5;
    component.updateDisplayedProducts();

    expect(component.displayedProducts.length).toBe(1);
    expect(component.displayedProducts[0].name).toBe('Apple');
  });

  it('should paginate displayedProducts according to pageSize', () => {
    component.allProducts = [];
    for(let i = 0; i < 10; i++) {
      component.allProducts.push({ id: i+'', name: `Product ${i}`, description: '', logo: 'null', date_release: new Date().toDateString(), date_revision: new Date().toDateString() });
    }
    component.pageSize = 3;
    component.updateDisplayedProducts();

    expect(component.displayedProducts.length).toBe(3);
  });

  it('should navigate to add product page', () => {
    component.goToAddProduct();
    expect(router.navigate).toHaveBeenCalledWith(['/products/new']);
  });

  it('should navigate to edit product page', () => {
    const product = { id: 123 } as any;
    component.onEdit(product);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/products/edit/123');
  });

  it('should open confirmation modal on delete', () => {
    const product = { id: 1, name: 'Test Product' } as any;
    component.onDelete(product);

    expect(component.showConfirmModal).toBe(true);
    expect(component.OnDeleteProduct).toEqual(product);
  });

  it('should confirm deletion and update lists on success', fakeAsync(() => {
    const product = { id: 1, name: 'ToDelete' } as any;
    component.allProducts = [product, { id: 2, name: 'Other' }] as any;
    component.OnDeleteProduct = product;
    component.showConfirmModal = true;

    const deleteSpy = jest.spyOn(productService, 'deleteById').mockReturnValue(of(null));
    const updateSpy = jest.spyOn(component, 'updateDisplayedProducts');

    component.confirmDelete();
    tick();

    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(component.showConfirmModal).toBe(false);
    expect(component.allProducts.find(p => p.id === '1')).toBeUndefined();
    expect(updateSpy).toHaveBeenCalled();
    expect(component.OnDeleteProduct).toBeUndefined();
    expect(component.showSuccessAlert).toBe(true);
  }));

  it('should handle error on deletion failure', fakeAsync(() => {
    const product = { id: 1, name: 'FailDelete' } as any;
    component.OnDeleteProduct = product;
    component.showConfirmModal = true;

    jest.spyOn(productService, 'deleteById').mockReturnValue(throwError(() => new Error('Delete failed')));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    component.confirmDelete();
    tick();

    expect(component.showConfirmModal).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Error deleting product:', expect.any(Error));
  }));

  it('should cancel delete', () => {
    component.showConfirmModal = true;
    component.cancelDelete();
    expect(component.showConfirmModal).toBe(false);
  });

  it('should validate image URLs correctly', () => {
    expect(component.isValidImageUrl(null)).toBe(false);
    expect(component.isValidImageUrl('')).toBe(false);
    expect(component.isValidImageUrl('http://example.com/image.png')).toBe(true);
    expect(component.isValidImageUrl('https://example.com/photo.jpg')).toBe(true);
    expect(component.isValidImageUrl('ftp://example.com/file.png')).toBe(false);
    expect(component.isValidImageUrl('invalid-url')).toBe(false);
  });
});
