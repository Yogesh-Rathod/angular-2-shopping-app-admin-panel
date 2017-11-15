import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';
import { FileUploadModule } from 'ng2-file-upload';

import { Pages } from './pages.component';

import { MerchandiseService } from 'app/services';
import { BulkUploadComponent } from './merchandise/categories/bulk-upload/bulk-upload.component';
import { ProductsBulkUploadComponent } from './merchandise/products/bulk-upload/bulk-upload.component';
import { VendorsBulkUploadComponent } from './merchandise/vendor/bulk-upload/bulk-upload.component';
import { CatalogBulkUploadComponent } from './merchandise/catalog-management/bulk-upload/bulk-upload.component';
import { MovieBulkUploadComponent } from './merchandise/movie-management/bulk-upload/bulk-upload.component';
import { VendorDeletePopupComponent } from './merchandise/vendor/delete-popup/delete-popup.component';
import { CategoryDeletePopupComponent } from './merchandise/categories/delete-popup/delete-popup.component';
import { ProductsDeletePopupComponent } from './merchandise/products/delete-popup/delete-popup.component';
import { BankDeletePopupComponent } from './merchandise/catalog-management/delete-popup/delete-popup.component';
import { MovieDeletePopupComponent } from './merchandise/movie-management/delete-popup/delete-popup.component';

import { XlsxToJsonService } from 'app/services';

@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    NgaModule,
    routing,
    FileUploadModule,
  ],
  declarations: [
    Pages,
    BulkUploadComponent,
    ProductsBulkUploadComponent,
    VendorsBulkUploadComponent,
    CatalogBulkUploadComponent,
    MovieBulkUploadComponent,
    VendorDeletePopupComponent,
    CategoryDeletePopupComponent,
    ProductsDeletePopupComponent,
    BankDeletePopupComponent,
    MovieDeletePopupComponent
  ],
  providers: [
    MerchandiseService,
    XlsxToJsonService
  ],
  entryComponents: [
    BulkUploadComponent,
    ProductsBulkUploadComponent,
    VendorsBulkUploadComponent,
    CatalogBulkUploadComponent,
    MovieBulkUploadComponent,
    VendorDeletePopupComponent,
    CategoryDeletePopupComponent,
    ProductsDeletePopupComponent,
    BankDeletePopupComponent,
    MovieDeletePopupComponent
  ],
})
export class PagesModule {
}
