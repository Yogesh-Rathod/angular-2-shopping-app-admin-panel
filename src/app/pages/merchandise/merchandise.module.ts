import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MerchandiseComponent } from './merchandise.component';
import { routing } from './merchandise.routing';
import { MerchandiseService } from 'app/services';
import { ApprovalsComponent } from './approvals/approvals.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    routing
  ],
  declarations: [
    MerchandiseComponent,
    ApprovalsComponent,
  ],
  providers: [
    MerchandiseService
  ],
  entryComponents: [
  ]
})

export class MerchandiseModule {}
