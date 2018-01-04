import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { UserManagementComponent } from 'lrshared_modules/pages/user-management/user-management.component';
import { AddEditUserComponent } from 'lrshared_modules/pages/user-management/addEditUser/addEditUser.component';


// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    data: {
      MenuCode: 'SYS'
    }
  },
  {
    path: 'edit/:id',
    loadChildren: 'lrshared_modules/pages/user-management/addEditUser/addEditUser.module#AddEditUserModule',
    data: {
      MenuCode: 'SYS'
    }
  },
  {
    path: 'add',
    loadChildren: 'lrshared_modules/pages/user-management/addEditUser/addEditUser.module#AddEditUserModule',
    data: {
      MenuCode: 'SYS'
    }
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
