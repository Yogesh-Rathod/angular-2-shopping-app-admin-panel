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
import { SellerProductsComponent } from './seller-products/seller-products.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppTranslationModule,
        routing,
        ReactiveFormsModule,
        DataTableModule,
        MyDatePickerModule,
        ProductsModule,
        AngularMultiSelectModule
    ],
    declarations: [
        ProfileComponent,
        OrdersComponent,
        FreshComponent,
        ProcessedComponent,
        DeliveredComponent,
        SellerProductsComponent
    ],
    providers: [
        ProductsService,
        OrdersService,
        JsonToExcelService
    ],
})
export class SellerModule { }
