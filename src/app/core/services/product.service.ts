import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importar el operador map
import { Product } from '../../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:3002/bp/products';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los productos.
   * La API devuelve un objeto { data: [...] }, usamos el operador map
   * para transformar la respuesta y devolver directamente el array de productos.
   * Esto simplifica la lógica en los componentes que consumen este método. 
   */
  getAll(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(this.baseUrl).pipe(
      map(response => response.data) // Devolvemos solo la propiedad 'data' del objeto de respuesta
    );
  }

  /**
   * Obtener producto por ID.
   * IMPORTANTE: La API de la prueba no provee un endpoint para GET /bp/products/:id.
   * La única forma de obtener un producto es buscarlo en la lista completa.
   */
  getById(id: string): Observable<Product | undefined> {
    return this.getAll().pipe(
      map(products => products.find(p => p.id === id)) // Filtramos en el cliente
    );
  }

  /**
   * Crear producto nuevo.
   * Coincide con la especificación de la API. 
   */
  create(product: Product): Observable<any> {
    return this.http.post(this.baseUrl, product);
  }

  /**
   * Actualizar producto existente.
   * Coincide con la especificación de la API, que espera un body sin 'id'. 
   */
  update(id: string, product: Omit<Product, 'id'>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, product);
  }

  /**
   * Eliminar producto por ID.
   * Coincide con la especificación de la API. 
   */
  deleteById(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Verificar si un ID ya existe en el backend.
   * Coincide con la especificación de la API. 
   */
  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }
}