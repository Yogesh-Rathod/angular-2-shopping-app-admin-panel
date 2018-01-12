import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../../app.translation.module';
import { MerchandiseService } from 'app/services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from "angular2-datatable";

import { routing } from './approvals.routes';

import { ApprovalsComponent } from './approvals.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { CatalogComponent } from './catalog/catalog.component';
import { CatalogManagementService } from "app/services";

@NgModule({
    imports: [
        CommonModule,
        AppTranslationModule,
        routing,
        ReactiveFormsModule,
        FormsModule,
        DataTableModule
    ],
    declarations: [
        ApprovalsComponent,
        CategoriesComponent,
        ProductsComponent,
        CatalogComponent
    ],
    providers: [
        CatalogManagementService
    ],
    entryComponents: [
    ]
})
export class ApprovalsModule { }
