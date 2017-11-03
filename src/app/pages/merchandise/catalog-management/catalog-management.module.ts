import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../../app.translation.module';
import { DataTableModule } from "angular2-datatable";
import { CKEditorModule } from 'ng2-ckeditor';
import { MerchandiseService } from 'app/services';
import { MyDatePickerModule } from 'mydatepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { routing } from './catalog-management.routes';
import { CatalogManagementComponent } from './catalog-management.component';
import { SearchBankPipe } from './search-banks.pipe';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { BasicInfoComponent } from "./bank-details/basic-info/basic-info.component";
import { ProductsInfoComponent } from './bank-details/products-info/products-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    routing,
    ReactiveFormsModule,
    CKEditorModule,
    DataTableModule,
    MyDatePickerModule,
    AngularMultiSelectModule
  ],
  declarations: [
    CatalogManagementComponent,
    SearchBankPipe,
    BankDetailsComponent,
    BasicInfoComponent,
    ProductsInfoComponent
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class CatalogManagementModule { }
