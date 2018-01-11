import { AuthGuard } from './../../../guards/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';

import { ApprovalsComponent } from './approvals.component';

const routes: Routes = [
    {
        path: '',
        component: ApprovalsComponent
    },
    {
        path: 'add-catalog',
        // component: AddCatalogComponent
    },
    {
        path: 'edit-catalog/:catalogId',
        // component: AddCatalogComponent
    },
    {
        path: 'catalog-details/:catalogId',
        // component: BankDetailsComponent
    }
];

export const routing = RouterModule.forChild(routes);

