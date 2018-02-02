import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'lrshared_modules/components/loader/loader.module';

@NgModule({
  imports: [
    CommonModule,
    LoaderModule,
  ],
  declarations: [
  ],
  exports: [
    LoaderModule
  ]
})
export class LrSharedComponentsModule { }
