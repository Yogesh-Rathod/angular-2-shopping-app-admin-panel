import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordModule } from './changepassword/change-password.module';
import { LoaderModule } from 'lrshared_modules/components/loader/loader.module';

@NgModule({
  imports: [
    CommonModule,
    ChangePasswordModule,
    LoaderModule,
  ],
  declarations: [
  ],
  exports: [
    LoaderModule
  ]
})
export class LrSharedComponentsModule { }
