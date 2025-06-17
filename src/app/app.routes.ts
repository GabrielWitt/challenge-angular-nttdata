import { Routes } from '@angular/router';
import { ProductListComponent } from './features/pages/product-list/product-list.component';
import { ProductFormComponent } from './features/pages/product-form/product-form.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductFormComponent },
  { path: '**', redirectTo: '' }
];
