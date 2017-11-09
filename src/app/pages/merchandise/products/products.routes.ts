import { AuthGuard } from './../../../guards/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './products.component';
import { AddProductComponent } from './add-product/add-product.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent
  },
  {
    path: 'vendorproducts/:vendorId',
    component: ProductsComponent
  },
  {
    path: 'vendorproducts/add-product/:vendorId',
    component: AddProductComponent
  },
  {
    path: 'add-product',
    component: AddProductComponent
  },
  {
    path: 'edit-product/:productId',
    component: AddProductComponent
  },
  {
    path: 'edit-product/:productId/:bankId',
    component: AddProductComponent
  }
];

export const routing = RouterModule.forChild(routes);

