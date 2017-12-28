import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  {
    path: 'seller',
    component: ProfileComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'orders',
    component: OrdersComponent
  }
];

export const routing = RouterModule.forChild(routes);

