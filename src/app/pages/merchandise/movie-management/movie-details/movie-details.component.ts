import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
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
  showMappingbuttons = {
    map: false,
    unmap: false
  };
  mappedMovies = [];

  constructor(
    private movieManagementService: MovieManagementService,
    public toastr: ToastsManager,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params =>
      this.movieId = params['movieId']
    )
  }

  ngOnInit() {
    this.getAllMovies();
    this.getMovieInfo();
  }

  initTooltip() {
    $(document).ready(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  getAllMovies() {
    // this.movies = this.movieManagementService.getMovies();
  }

  getMovieInfo() {
    this.bigLoader = true;
    if (this.movieId) {
      this.movieManagementService.getMoviedetails(this.movieId).
        then((moviesInfo) => {
          console.log("moviesInfo movies ", moviesInfo);
          this.movieInfo = moviesInfo.Data;
          this.bigLoader = false;
          this.initTooltip();
        }).catch((error) => {
          console.log("error ", error);
          if (error.Code === 500) {
            this.toastr.error('Oops! Something went wrong. Please try again later.', 'Error!', { toastLife: 1500 });
          }
          this.bigLoader = false;
          this.initTooltip();
        });
    }
  }

  selectAll(e) {
    if (e.target.checked) {
      this.selectAllCheckboxUnMap = true;
      _.forEach(this.movies, (item) => {
        item.isChecked = true;
      });
      this.showMappingbuttons.map = true;
    } else {
      this.selectAllCheckboxUnMap = false;
      _.forEach(this.movies, (item) => {
        item.isChecked = false;
      });
      this.showMappingbuttons.map = false;
    }
  }

  selectAllMapped(e) {
    if (e.target.checked) {
      this.selectAllCheckboxMapped = true;
      _.forEach(this.mappedMovies, (item) => {
        item.isChecked = true;
      });
      this.showMappingbuttons.unmap = true;
    } else {
      this.selectAllCheckboxMapped = false;
      _.forEach(this.mappedMovies, (item) => {
        item.isChecked = false;
      });
      this.showMappingbuttons.unmap = false;
    }
  }

  checkBoxSelected(e, item) {
    this.selectAllCheckboxUnMap = false;
    this.selectAllCheckboxMapped= false;

    if (e.target.checked) {
      item.isChecked = true;
      this.movieInfo = item;
    } else {
      item.isChecked = false;
    }

    let isCheckedArray = [];

    _.forEach(this.movies, (item) => {
      if (item.isChecked) {
        this.showMappingbuttons.map = true;
        isCheckedArray.push(item);
      }
    });

    _.forEach(this.mappedMovies, (item) => {
      if (item.isChecked) {
        this.showMappingbuttons.unmap = true;
        isCheckedArray.push(item);
      }
    });

    if (isCheckedArray.length === 0) {
      this.showMappingbuttons.map = false;
    }
  }

  mapAMovie() {
    if (this.selectAllCheckboxUnMap) {
      this.mappedMovies = this.movies;
      this.movies = [];
      this.showMappingbuttons.map = false;
      this.selectAllCheckboxUnMap = false;
      _.forEach(this.mappedMovies, (item) => {
        item.isChecked = false;
      });
    } else {
      this.mapSelectedMovies();
    }
  }

  mapSelectedMovies() {
    _.forEach(this.movies, (item) => {
      if (item.isChecked) {
        this.mappedMovies.push(item);
        item.isChecked = false;
        setTimeout(() => {
          _.remove(this.movies, item);
        }, 100);
      }
    });
    this.selectAllCheckboxUnMap = false;
    this.showMappingbuttons.map = false;
  }

  unMapSelectedMovies() {
    let unMappedItem;
    _.forEach(this.mappedMovies, (item) => {
      if (item.isChecked) {
        this.movies.push(item);
        item.isChecked = false;
        setTimeout(() => {
          _.remove(this.mappedMovies, item);
        }, 100);
      }
    });
    this.selectAllCheckboxUnMap = false;
    this.showMappingbuttons.unmap = false;
  }

  unMapAMovie() {
    if (this.selectAllCheckboxMapped) {
      this.movies = this.mappedMovies;
      this.mappedMovies = [];
      this.showMappingbuttons.unmap = false;
      this.selectAllCheckboxMapped = false;
      _.forEach(this.movies, (item) => {
        item.isChecked = false;
      });
    } else {
      this.unMapSelectedMovies();
    }
  }

}
