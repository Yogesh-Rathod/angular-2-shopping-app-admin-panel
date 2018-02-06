import { NgModule } from '@angular/core';
import { UserManagementComponent } from 'users_modules/pages/user-management/user-management.component';
import { routing } from 'users_modules/pages/user-management/user-management.routing';
import { NgaModule } from 'app/theme/nga.module';
import { DataTableModule } from "angular2-datatable";

import { AddEditUserComponent } from 'users_modules/pages/user-management/addEditUser/addEditUser.component';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from 'app/app.translation.module';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'users_modules/components/loader/loader.module';

@NgModule({
  imports: [
    NgaModule,
    routing,
    AppTranslationModule,
    CommonModule,
    AngularFormsModule,
    ReactiveFormsModule,
    LoaderModule,
    DataTableModule
  ],
  declarations: [
    UserManagementComponent,
  ],
  providers: [
  ]
})
export class UserManagementModule { }
