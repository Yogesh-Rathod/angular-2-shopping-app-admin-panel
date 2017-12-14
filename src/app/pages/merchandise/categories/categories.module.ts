import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../../app.translation.module';
import { routing } from './categories.routes';
import { DataTableModule } from "angular2-datatable";

import { CKEditorModule } from 'ng2-ckeditor';
import { CategoriesComponent } from './categories.component';
import { MerchandiseService, XlsxToJsonService } from 'app/services';
import { AddCategoryComponent } from './add-category/add-category.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    routing,
    ReactiveFormsModule,
    CKEditorModule,
    DataTableModule
  ],
  declarations: [
    CategoriesComponent,
    AddCategoryComponent
  ],
  providers: [
    MerchandiseService,
    XlsxToJsonService
  ],
  entryComponents: [
    // BulkUploadComponent
  ]
})
export class CategoriesModule {}
