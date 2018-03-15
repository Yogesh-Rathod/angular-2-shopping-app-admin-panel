import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';
import { FileUploadModule } from 'ng2-file-upload';
import { MyDatePickerModule } from 'mydatepicker';

import { Pages } from './pages.component';

import { MerchandiseService, MovieManagementService, ProductsService, JsonToExcelService } from 'app/services';
import { BulkUploadComponent } from './merchandise/categories/bulk-upload/bulk-upload.component';
import { ProductsBulkUploadComponent } from './merchandise/products/bulk-upload/bulk-upload.component';
import { VendorsBulkUploadComponent } from './merchandise/vendor/bulk-upload/bulk-upload.component';
import { CatalogBulkUploadComponent } from './merchandise/catalog-management/bulk-upload/bulk-upload.component';
import { MovieBulkUploadComponent } from './merchandise/movie-management/bulk-upload/bulk-upload.component';
import { SellerOrdersBulkUploadComponent } from './merchandise/seller/orders/bulk-upload/bulk-upload.component';
import { XlsxToJsonService, OrdersService } from 'app/services';
import { HomeComponent } from './home/home.component';
import { SellsBulkUploadComponent } from 'app/pages/merchandise/seller/seller-products/bulk-upload/bulk-upload.component';
import { SellerOrdersAdminBulkUploadComponent } from './merchandise/orders/bulk-upload/bulk-upload.component';
import { StatusUpdateComponent } from './merchandise/orders/status-update/status-update.component';
import { SellerOrderStatusUpdateComponent } from './merchandise/seller/orders/status-update/status-update.component';
import { DeleteMoviePopupComponent } from './merchandise/movie-management/delete-popup/delete-popup.component';

@NgModule({
    imports: [
        CommonModule,
        AppTranslationModule,
        NgaModule,
        routing,
        FileUploadModule,
        FormsModule,
        ReactiveFormsModule,
        MyDatePickerModule
    ],
    declarations: [
        Pages,
        BulkUploadComponent,
        ProductsBulkUploadComponent,
        VendorsBulkUploadComponent,
        CatalogBulkUploadComponent,
        MovieBulkUploadComponent,
        SellsBulkUploadComponent,
        HomeComponent,
        SellerOrdersBulkUploadComponent,
        SellerOrdersAdminBulkUploadComponent,
        StatusUpdateComponent,
        DeleteMoviePopupComponent,
        SellerOrderStatusUpdateComponent
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
        SellsBulkUploadComponent,
        SellerOrdersBulkUploadComponent,
        SellerOrdersAdminBulkUploadComponent,
        StatusUpdateComponent,
        DeleteMoviePopupComponent,
        SellerOrderStatusUpdateComponent
    ],
})
export class PagesModule {
}
