import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';
import { FileUploadModule } from 'ng2-file-upload';

import { Pages } from './pages.component';

import { MerchandiseService, MovieManagementService, ProductsService, JsonToExcelService } from 'app/services';
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

import { SellerOrdersBulkUploadComponent } from './merchandise/seller/orders/bulk-upload/bulk-upload.component';


import { XlsxToJsonService, OrdersService } from 'app/services';
import { HomeComponent } from './home/home.component';
import { SellsBulkUploadComponent } from 'app/pages/merchandise/seller/seller-products/bulk-upload/bulk-upload.component';
import { SellerOrdersAdminBulkUploadComponent } from './merchandise/orders/bulk-upload/bulk-upload.component';

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
    MovieDeletePopupComponent,
    SellsBulkUploadComponent,
    HomeComponent,
    SellerOrdersBulkUploadComponent,
      SellerOrdersAdminBulkUploadComponent
  ],
  providers: [
    MerchandiseService,
    MovieManagementService,
    XlsxToJsonService,
    ProductsService,
    JsonToExcelService,
    OrdersService
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
    MovieDeletePopupComponent,
    SellsBulkUploadComponent,
    SellerOrdersBulkUploadComponent,
      SellerOrdersAdminBulkUploadComponent
  ],
})
export class PagesModule {
}
