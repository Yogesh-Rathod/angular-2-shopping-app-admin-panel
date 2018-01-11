import { Routes, RouterModule } from '@angular/router';

import { MerchandiseComponent } from './merchandise.component';

import { ApprovalsComponent } from './approvals/approvals.component';

const routes: Routes = [
    {
        path: '',
        component: MerchandiseComponent,
        children: [
            {
                path: 'merchandise',
                redirectTo: 'merchandise',
                pathMatch: 'merchandise'
            },
            {
                path: 'categories',
                loadChildren: './categories/categories.module#CategoriesModule',
                data: {
                    MenuCode: 'PRD'
                }
            },
            {
                path: 'products',
                loadChildren: './products/products.module#ProductsModule',
                data: {
                    MenuCode: 'PRD'
                }
            },
            {
                path: 'vendors',
                loadChildren: './vendor/vendor.module#VendorModule',
                data: {
                    MenuCode: 'PRD'
                }
            },
            {
                path: 'catalog-management',
                loadChildren: './catalog-management/catalog-management.module#CatalogManagementModule',
                data: {
                    MenuCode: 'PRD'
                }
            },
            {
                path: 'approvals',
                component: ApprovalsComponent,
                data: {
                    MenuCode: 'PRD'
                }
            }
        ],
    },
];

export const routing = RouterModule.forChild(routes);