import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../../app.translation.module';
import { routing } from './categories.routes';
import { DataTableModule } from "angular2-datatable";

import { CKEditorModule } from 'ng2-ckeditor';
import { CategoriesComponent } from './categories.component';
import { MerchandiseService } from 'app/services';
import { AddCategoryComponent } from './add-category/add-category.component';
import { SearchCategoryPipe } from './search-category.pipe';

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
    AddCategoryComponent,
    SearchCategoryPipe
  ],
  providers: [
    MerchandiseService
  ],
  entryComponents: [
    // BulkUploadComponent
  ]
})
export class CategoriesModule {}
