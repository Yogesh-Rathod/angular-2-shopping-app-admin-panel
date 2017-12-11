import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../../app.translation.module';
import { DataTableModule } from "angular2-datatable";
import { CKEditorModule } from 'ng2-ckeditor';
import { MerchandiseService } from 'app/services';
import { MyDatePickerModule } from 'mydatepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { routing } from './movie-management.routes';
import { MovieManagementService, XlsxToJsonService } from 'app/services';
import { MovieManagementComponent } from './movie-management.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { AddCinemaComponent } from './add-cinema/add-cinema.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';

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
    MovieManagementComponent,
    AddMovieComponent,
    AddCinemaComponent,
    MovieDetailsComponent
  ],
  providers: [
    MovieManagementService,
    XlsxToJsonService
  ],
  entryComponents: [
  ]
})
export class MovieManagementModule { }
