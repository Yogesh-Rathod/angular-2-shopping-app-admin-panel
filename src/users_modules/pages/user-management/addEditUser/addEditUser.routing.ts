import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AddEditUserComponent } from './addEditUser.component';


// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: AddEditUserComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
