import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from '../products/products.component';

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
        component: ProductsComponent,
        data: {
            MenuCode: 'SLR'
        }
    }
];

export const routing = RouterModule.forChild(routes);

