import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../../app.translation.module';
import { routing } from './orders.routes';
import { DataTableModule } from "angular2-datatable";
import { CKEditorModule } from 'ng2-ckeditor';
import { MerchandiseService } from 'app/services';
import { MyDatePickerModule } from 'mydatepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { OrdersComponent } from "./orders.component";
import { ProductsService, OrdersService, VendorsService, JsonToExcelService, CatalogManagementService } from 'app/services';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { BasicInfoComponent } from './order-details/basic-info/basic-info.component';
import { BillingInfoComponent } from './order-details/billing-info/billing-info.component';
import { ShippingInfoComponent } from './order-details/shipping-info/shipping-info.component';
import { ProductsComponent } from './order-details/products/products.component';
import { ReportsComponent } from './reports/reports.component';
import { FreshComponent } from './fresh/fresh.component';
import { ProcessedComponent } from './processed/processed.component';
import { DeliveredComponent } from './delivered/delivered.component';
import { ShippedComponent } from './shipped/shipped.component';
import { CancellledComponent } from './cancellled/cancellled.component';
import { RtoOrdersComponent } from './rto-orders/rto-orders.component';

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
        ProcessedComponent,
        DeliveredComponent,
        ShippedComponent,
        OrdersComponent,
        OrderDetailsComponent,
        BasicInfoComponent,
        BillingInfoComponent,
        ShippingInfoComponent,
        ProductsComponent,
        ReportsComponent,
        FreshComponent,
        ProcessedComponent,
        CancellledComponent,
        RtoOrdersComponent
    ],
    providers: [
        MerchandiseService,
        ProductsService,
        OrdersService,
        VendorsService,
        JsonToExcelService,
        CatalogManagementService
    ],
    entryComponents: [
    ]
})
export class OrdersModule { }
