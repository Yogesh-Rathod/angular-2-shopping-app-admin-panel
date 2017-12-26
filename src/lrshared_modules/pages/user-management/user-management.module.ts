import { NgModule } from '@angular/core';
import { UserManagementComponent } from 'lrshared_modules/pages/user-management/user-management.component';
import { routing } from 'lrshared_modules/pages/user-management/user-management.routing';
import { NgaModule } from 'app/theme/nga.module';
import { AddEditUserComponent } from 'lrshared_modules/pages/user-management/addEditUser/addEditUser.component';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditAuthorityComponent } from 'lrshared_modules/pages/user-management/addEditAuthority/addEditAuthority.component';
import { AppTranslationModule } from 'app/app.translation.module';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination/dist/ngx-pagination';
import { LoaderModule } from 'lrshared_modules/components/loader/loader.module';

@NgModule({
  imports: [
    NgaModule,
    routing,
    AppTranslationModule,
    CommonModule,
    AngularFormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    LoaderModule
  ],
  declarations: [
    UserManagementComponent,
  ],
  providers: [
  ]
})
export class UserManagementModule { }
