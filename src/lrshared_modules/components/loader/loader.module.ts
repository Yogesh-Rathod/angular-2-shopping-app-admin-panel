import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader.component';

import { NgaModule } from 'app/theme/nga.module';

@NgModule({
  imports: [
    CommonModule,
    NgaModule,
  ],
  declarations: [
    LoaderComponent
  ],
  entryComponents: [
    LoaderComponent
  ],
  exports: [
    LoaderComponent
  ]
})
export class LoaderModule { }
