import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from '../products/products.component';
import { SellerProductsComponent } from 'app/pages/merchandise/seller/seller-products/seller-products.component';
import { AddSellerProductComponent } from 'app/pages/merchandise/seller/seller-products/add-product/add-seller-product.component';

const routes: Routes = [
    {
        path: 'seller',
        component: ProfileComponent,
        data: {
            MenuCode: 'SLR'
        }
    },
    {
        path: 'profile',
        component: ProfileComponent,
        data: {
            MenuCode: 'SLR'
        }
    },
    {
        path: 'orders',
        component: OrdersComponent,
        data: {
            MenuCode: 'SLR'
        }
    },
    {
        path: 'seller-products',
        component: SellerProductsComponent,
        data: {
            MenuCode: 'SLR'
        }
    },
    {
        path: 'add-seller-product',
        component: AddSellerProductComponent,
        data: {
            MenuCode: 'SLR'
        }
    },
    {
        path: 'add-seller-product/:vendorId',
        component: AddSellerProductComponent,
        data: {
          MenuCode: 'SLR'
        }
      },
      {
        path: 'edit-seller-product/:productId',
        component: AddSellerProductComponent,
        data: {
          MenuCode: 'SLR'
        }
      },
      {
        path: 'edit-seller-product/:productId/:bankId',
        component: AddSellerProductComponent,
        data: {
          MenuCode: 'SLR'
        }
      }
];

export const routing = RouterModule.forChild(routes);

