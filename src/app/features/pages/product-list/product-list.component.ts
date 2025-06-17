import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { DropdownMenuComponent } from '../../../shared/dropdown-menu/dropdown-menu.component';
import { SkeletonLoaderComponent } from '../../../shared/skeleton-loader/skeleton-loader.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalConfirmationComponent } from "../../../shared/modal-confirmation/modal-confirmation.component";
import { AlertModalComponent } from "../../../shared/alert-modal/alert-modal.component";

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    FormsModule,
    DropdownMenuComponent,
    SkeletonLoaderComponent,
    ModalConfirmationComponent,
    AlertModalComponent
],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  public isLoading = true;
  public allProducts: Product[] = [];
  public displayedProducts: Product[] = [];

  // Propiedades para búsqueda y paginación
  public searchTerm = '';
  public pageSize = 5;
  public readonly pageSizeOptions = [5, 10, 20];

  private destroy$ = new Subject<void>();
  showConfirmModal: boolean = false;
  OnDeleteProduct!: Product | undefined;
  showSuccessAlert: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.productService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.allProducts = products;
          this.updateDisplayedProducts();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.isLoading = false;
          // Aquí se podría implementar un mensaje de error visual para el usuario 
        }
      });
  }

  // Se ejecuta cada vez que cambia el término de búsqueda o el tamaño de la página
  updateDisplayedProducts(): void {
    let filtered = this.allProducts;

    // 1. Filtrar por término de búsqueda (F2)
    if (this.searchTerm) {
      filtered = this.allProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // 2. Aplicar paginación (F3)
    this.displayedProducts = filtered.slice(0, this.pageSize);
  }

  // --- Navegación y Acciones ---

  goToAddProduct(): void {
    this.router.navigate(['/products/new']);
  }

  onEdit(product: Product): void {
    this.router.navigateByUrl(`/products/edit/${product.id}`);
  }

  onDelete(product: Product): void {
    this.OnDeleteProduct = product; // Guardar el producto a eliminar
    this.showConfirmModal = true;
  }

  // --- Modal Confirmation Actions ---

  // Este método se llamará desde el modal de confirmación
  // para CONFIRMAR la eliminación del producto (F6)
  confirmDelete(): void {
    if(!this.OnDeleteProduct) {
      console.error('No product selected for deletion');
      this.showConfirmModal = false;
      return;
    }
    
    const productId = this.OnDeleteProduct.id;
    this.productService.deleteById(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showConfirmModal = false;
          // Actualizar la lista de productos después de eliminar
          this.allProducts = this.allProducts.filter(p => p.id !== productId);
          this.OnDeleteProduct = undefined; // Limpiar la referencia al producto eliminado
          this.showSuccessAlert = true; // Mostrar alerta de éxito
          this.updateDisplayedProducts();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.showConfirmModal = false;
        }
      });
  }

  // Este método se llamará desde el modal de confirmación
  // para CANCELAR la eliminación del producto (F6)
  cancelDelete(): void {
    this.showConfirmModal = false;
  }

  isValidImageUrl(url: string | null | undefined): boolean {
    if (!url) return false;

    // Verifica si la URL tiene un formato válido básico (puedes mejorar esta regex si quieres)
    const pattern = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))/i;
    return pattern.test(url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}