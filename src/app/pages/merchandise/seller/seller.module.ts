import { DataTableModule } from 'angular2-datatable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../../app.translation.module';
import { routing } from './seller.routes';
import { CKEditorModule } from 'ng2-ckeditor';

import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    routing,
    ReactiveFormsModule,
    DataTableModule,
    CKEditorModule
  ],
  declarations: [
    ProfileComponent,
    OrdersComponent
  ],
  providers: [
  ],
})
export class SellerModule {}
