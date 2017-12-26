import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './changepassword.component';

import { NgaModule } from 'app/theme/nga.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ChangePasswordComponent
  ],
  entryComponents: [
    ChangePasswordComponent
  ]
})
export class ChangePasswordModule { }
