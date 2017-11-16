import { AuthGuard } from './../../../guards/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';

import { MovieManagementComponent } from './movie-management.component';

import { AddMovieComponent } from './add-movie/add-movie.component';
import { AddCinemaComponent } from './add-cinema/add-cinema.component';

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
  },
  {
    path: 'add-cinema',
    component: AddCinemaComponent
  }
];

export const routing = RouterModule.forChild(routes);

