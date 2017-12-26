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
      friendlyName: 'User Management',
      name: 'userManagement'
    }
  },
  {
    path: 'edit/:id',
    loadChildren: 'lrshared_modules/pages/user-management/addEditUser/addEditUser.module#AddEditUserModule',
    data: {
      friendlyName: 'Edit User',
      name: 'editUser'  
    }
  },
  {
    path: 'add',
    loadChildren: 'lrshared_modules/pages/user-management/addEditUser/addEditUser.module#AddEditUserModule',
    data: {
      friendlyName: 'Add User',
      name: 'addUser'
    }
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
