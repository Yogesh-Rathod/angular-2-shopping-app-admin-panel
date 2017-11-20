import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
declare let $: any;

import { MovieManagementService } from 'app/services';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {

  bigLoader = false;
  movieId: any;
  movies: any;
  movieInfo: any;

  constructor(
    private movieManagementService: MovieManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params =>
      this.movieId = params['movieId']
    )
  }

  ngOnInit() {
    $(document).ready(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });

    this.getAllMovies();
    this.getMovieInfo();
  }

  getAllMovies() {
    this.movies = this.movieManagementService.getMovies();
  }

  getMovieInfo() {
    if (this.movieId) {
      const movies = this.movieManagementService.getMovies();
      _.forEach(movies, (movie) => {
        if (movie.id === parseInt(this.movieId)) {
          this.movieInfo = movie;
          console.log("this.movieInfo ", this.movieInfo);
        }
      });
    }
  }

}
