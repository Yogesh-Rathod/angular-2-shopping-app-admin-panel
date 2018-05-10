import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MerchandiseComponent } from './merchandise.component';
import { routing } from './merchandise.routing';
import { MerchandiseService, VendorsService } from 'app/services';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, routing],
    declarations: [MerchandiseComponent],
    providers: [MerchandiseService, VendorsService],
    entryComponents: []
})
export class MerchandiseModule {}
