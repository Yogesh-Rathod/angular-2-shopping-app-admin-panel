import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditUserComponent } from './addEditUser.component';

import { NgaModule } from 'app/theme/nga.module';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { routing } from './addEditUser.routing';
import { AppTranslationModule } from 'app/app.translation.module';
import { LoaderModule } from 'users_modules/components/loader/loader.module';

@NgModule({
    imports: [
        NgaModule,
        routing,
        AppTranslationModule,
        CommonModule,
        AngularFormsModule,
        CommonModule,
        NgaModule,
        ReactiveFormsModule,
        AngularMultiSelectModule,
        routing,
        LoaderModule,
        AngularMultiSelectModule,
    ],
    declarations: [
        AddEditUserComponent
    ]
})
export class AddEditUserModule { }
