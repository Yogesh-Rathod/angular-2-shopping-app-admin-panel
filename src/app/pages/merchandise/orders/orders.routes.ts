import { AuthGuard } from './../../../guards/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';

import { OrdersComponent } from './orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: 'orders',
    component: OrdersComponent
  },
  {
    path: 'orders/order-details/:orderId',
    component: OrderDetailsComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  }
];

export const routing = RouterModule.forChild(routes);

