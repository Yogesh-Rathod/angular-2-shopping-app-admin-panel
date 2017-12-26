import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './login.routing';
import { LoginComponent } from './login.component';
import { NgaModule } from 'app/theme/nga.module';

import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppTranslationModule } from 'app/app.translation.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrmService, AdminService, MerchandiseService, RetailService } from 'lrshared_modules/services/roleServices';

@NgModule({
  imports: [
    NgaModule,
    CommonModule,
    routing,
    AppTranslationModule,
    AngularFormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    NgbActiveModal,
    CrmService,
    AdminService,
    MerchandiseService,
    RetailService
  ]
})
export class LoginModule {}
