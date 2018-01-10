import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from 'app/theme/nga.module';
import { LrSharedComponentsModule } from './components/lr-shared-components.module';
import { LrSharedServicesModule } from './services/lr-shared-services.module';

import { LoaderComponent } from 'lrshared_modules/components/loader/loader.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from 'app/app.translation.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule,
    LrSharedComponentsModule,
    LrSharedServicesModule,
    AppTranslationModule,
    AppTranslationModule
  ],
  declarations: [
  ],
  entryComponents: [
  ],
  providers: [
  ],
  exports: [
    LrSharedComponentsModule
  ]
})
export class LrSharedModule { }
