import { AuthGuard } from './../../../guards/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';

import { MovieManagementComponent } from './movie-management.component';

import { AddMovieComponent } from './add-movie/add-movie.component';

const routes: Routes = [
  {
    path: '',
    component: MovieManagementComponent
  },
  {
    path: 'add-movie',
    component: AddMovieComponent
  },
  {
    path: 'edit-movie/:movieId',
    component: AddMovieComponent
  }
];

export const routing = RouterModule.forChild(routes);

