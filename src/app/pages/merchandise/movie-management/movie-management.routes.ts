import { AuthGuard } from './../../../guards/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';

import { MovieManagementComponent } from './movie-management.component';

const routes: Routes = [
  {
    path: '',
    component: MovieManagementComponent
  }
];

export const routing = RouterModule.forChild(routes);

