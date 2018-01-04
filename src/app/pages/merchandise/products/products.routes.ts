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
    component: ProductsComponent,
    data: {
      MenuCode: 'PRD'
    }
  },
  {
    path: 'vendorproducts/add-product/:vendorId',
    component: AddProductComponent,
    data: {
      MenuCode: 'PRD'
    }
  },
  {
    path: 'add-product',
    component: AddProductComponent,
    data: {
      MenuCode: 'PRD'
    }
  },
  {
    path: 'edit-product/:productId',
    component: AddProductComponent,
    data: {
      MenuCode: 'PRD'
    }
  },
  {
    path: 'edit-product/:productId/:bankId',
    component: AddProductComponent,
    data: {
      MenuCode: 'PRD'
    }
  }
];

export const routing = RouterModule.forChild(routes);

