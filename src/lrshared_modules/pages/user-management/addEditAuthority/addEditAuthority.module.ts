import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditAuthorityComponent } from './addEditAuthority.component';

import { NgaModule } from 'app/theme/nga.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule
  ],
  declarations: [
    AddEditAuthorityComponent
  ],
  entryComponents: [
    AddEditAuthorityComponent
  ]
})
export class AddEditAuthorityModule { }
