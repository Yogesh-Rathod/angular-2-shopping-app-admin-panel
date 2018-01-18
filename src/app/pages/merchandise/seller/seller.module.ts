import { DataTableModule } from 'angular2-datatable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../../app.translation.module';
import { routing } from './seller.routes';
import { MyDatePickerModule } from 'mydatepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ProductsModule } from '../products/products.module';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsService, OrdersService, JsonToExcelService } from 'app/services';
import { FreshComponent } from './orders/fresh/fresh.component';
import { ProcessedComponent } from './orders/processed/processed.component';
import { DeliveredComponent } from './orders/delivered/delivered.component';
import { RtoComponent } from './orders/rto/rto.component';

import { ShippedComponent } from './orders/shipped/shipped.component';
import { SellerProductsComponent } from './seller-products/seller-products.component';
import { AddSellerProductComponent } from 'app/pages/merchandise/seller/seller-products/add-product/add-seller-product.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { DateTimePickerModule } from 'ng-pick-datetime';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { CancellledComponent } from './orders/cancellled/cancellled.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppTranslationModule,
        routing,
        ReactiveFormsModule,
        DataTableModule,
        CKEditorModule,
        MyDatePickerModule,
        ProductsModule,
        AngularMultiSelectModule,
        DateTimePickerModule
    ],
    declarations: [
        ProfileComponent,
        OrdersComponent,
        FreshComponent,
        ProcessedComponent,
        DeliveredComponent,
        AddSellerProductComponent,
        SellerProductsComponent,
        ShippedComponent,
        OrderDetailsComponent,
        RtoComponent,
        CancellledComponent
    ],
    providers: [
        ProductsService,
        OrdersService,
        JsonToExcelService
    ],
})
export class SellerModule { }
