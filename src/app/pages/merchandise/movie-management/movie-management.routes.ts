import { AuthGuard } from './../../../guards/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';

import { MovieManagementComponent } from './movie-management.component';

import { AddMovieComponent } from './add-movie/add-movie.component';
import { AddCinemaComponent } from './add-cinema/add-cinema.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';

const routes: Routes = [
  {
    path: '',
    component: MovieManagementComponent
  },
  {
    path: 'add-movie',
    component: AddMovieComponent,
    data: {
      MenuCode: 'MOV'
    }
  },
  {
    path: 'edit-movie/:movieId',
    component: AddMovieComponent,
    data: {
      MenuCode: 'MOV'
    }
  },
  {
    path: 'add-cinema',
    component: AddCinemaComponent,
    data: {
      MenuCode: 'MOV'
    }
  },
  {
    path: 'movie-details/:movieId',
    component: MovieDetailsComponent,
    data: {
      MenuCode: 'MOV'
    }
  }
];

export const routing = RouterModule.forChild(routes);

