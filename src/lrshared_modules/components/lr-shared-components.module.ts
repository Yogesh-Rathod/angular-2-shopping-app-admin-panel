import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordModule } from './changepassword/change-password.module';
import { LoaderModule } from 'lrshared_modules/components/loader/loader.module';
import { AddEditAuthorityModule } from 'lrshared_modules/pages/user-management/addEditAuthority/addEditAuthority.module';

@NgModule({
  imports: [
    CommonModule,
    ChangePasswordModule,
    LoaderModule,
    AddEditAuthorityModule,
  ],
  declarations: [
  ],
  exports: [
    LoaderModule
  ]
})
export class LrSharedComponentsModule { }
