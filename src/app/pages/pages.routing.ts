import { AuthGuard } from './../guards/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { NotFoundComponent } from '../not-found/not-found.component';
import { HomeComponent } from 'app/pages/home/home.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [AuthGuard],
    loadChildren: 'users_modules/pages/login/login.module#LoginModule'
  },
  {
    path: '',
    component: Pages,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'merchandise',
        loadChildren: './merchandise/merchandise.module#MerchandiseModule',
        data: {
          MenuCode: 'PRD'
        }
      },
      {
        path: 'user-management',
        loadChildren: 'users_modules/pages/user-management/user-management.module#UserManagementModule',
        data: {
          MenuCode: 'SYS'
        }
      },
      {
        path: 'order-management',
        loadChildren: './merchandise/orders/orders.module#OrdersModule',
        data: {
          MenuCode: 'ORD'
        }
      },
      // {
      //   path: 'catalog-management',
      //   loadChildren: './merchandise/catalog-management/catalog-management.module#CatalogManagementModule'
      // },
      {
        path: 'movie-management',
        loadChildren: './merchandise/movie-management/movie-management.module#MovieManagementModule',
        data: {
          MenuCode: 'MOV'
        }
      },
      {
        path: 'home',
        component: HomeComponent,
        data: {
          MenuCode: 'HOM'
        }
      },
      {
        path: 'seller',
        loadChildren: './merchandise/seller/seller.module#SellerModule',
        data: {
          MenuCode: 'SLR'
        }
      },
      {
        path: 'PageNotFound',
        component: NotFoundComponent
      }
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
