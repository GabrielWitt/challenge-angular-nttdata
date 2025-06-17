import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { provideHttpClient } from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should fetch all products', () => {
    const mock = [{
      id: '1',
      name: 'Test',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    }];

    service.getAll().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].name).toBe('Test');
    });

    const req = http.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mock });
  });
});
