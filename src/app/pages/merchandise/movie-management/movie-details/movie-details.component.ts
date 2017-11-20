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
  selectAllCheckboxUnMap = false;
  selectAllCheckboxMapped = false;
  showMappingbuttons = false;
  mappedMovies = [];

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
        }
      });
    }
  }

  selectAll(e) {
    if (e.target.checked) {
      this.selectAllCheckboxUnMap = true;
      _.forEach(this.movies, (item) => {
        item.isChecked = true;
      });
      this.showMappingbuttons = true;
    } else {
      this.selectAllCheckboxUnMap = false;
      _.forEach(this.movies, (item) => {
        item.isChecked = false;
      });
      this.showMappingbuttons = false;
    }
  }

  selectAllMapped(e) {
    if (e.target.checked) {
      this.selectAllCheckboxMapped = true;
      _.forEach(this.mappedMovies, (item) => {
        item.isChecked = true;
      });
      this.showMappingbuttons = true;
    } else {
      this.selectAllCheckboxMapped = false;
      _.forEach(this.mappedMovies, (item) => {
        item.isChecked = false;
      });
      this.showMappingbuttons = false;
    }
  }

  checkBoxSelected(e, item) {
    this.selectAllCheckboxUnMap = false;
    if (e.target.checked) {
      item.isChecked = true;
    } else {
      item.isChecked = false;
    }

    let isCheckedArray = [];

    _.forEach(this.movies, (item) => {
      if (item.isChecked) {
        this.showMappingbuttons = true;
        isCheckedArray.push(item);
      }
    });

    _.forEach(this.mappedMovies, (item) => {
      if (item.isChecked) {
        this.showMappingbuttons = true;
        isCheckedArray.push(item);
      }
    });

    if (isCheckedArray.length === 0) {
      this.showMappingbuttons = false;
    }
  }

  mapAMovie() {
    if (this.selectAllCheckboxUnMap) {
      this.mappedMovies = this.movies;
      this.movies = [];
      this.showMappingbuttons = false;
      this.selectAllCheckboxUnMap = false;
      _.forEach(this.mappedMovies, (item) => {
        item.isChecked = false;
      });
    } else {
      this.mapSelectedMovies();
    }
  }

  mapSelectedMovies() {
    let mappedItem;
    _.forEach(this.movies, (item) => {
      if (item.isChecked) {
        this.mappedMovies.push(item);
        item.isChecked = false;
        mappedItem = item;
        setTimeout(() => {
          _.remove(this.movies, item);
        }, 100);
      }
    });
    this.selectAllCheckboxUnMap = false;
    this.showMappingbuttons = false;
  }

  unMapSelectedMovies() {
    let unMappedItem;
    _.forEach(this.mappedMovies, (item) => {
      if (item.isChecked) {
        this.movies.push(item);
        item.isChecked = false;
        unMappedItem = item;
      }
    });
    _.remove(this.mappedMovies, unMappedItem);
    this.selectAllCheckboxUnMap = false;
    this.showMappingbuttons = false;
  }

  unMapAMovie() {
    console.log("this.selectAllCheckboxMapped ", this.selectAllCheckboxMapped);
    if (this.selectAllCheckboxMapped) {
      this.movies = this.mappedMovies;
      this.mappedMovies = [];
      this.showMappingbuttons = false;
      this.selectAllCheckboxMapped = false;
      _.forEach(this.movies, (item) => {
        item.isChecked = false;
      });
    } else {
      this.unMapSelectedMovies();
    }
  }

}
