import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'lodash';
declare let $: any;

import { RegEx } from './../../../regular-expressions';
import { MovieManagementService } from 'app/services';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss']
})
export class AddMovieComponent implements OnInit {

  movieId: any;
  addMovieForm: FormGroup;
  deleteLoader = false;
  showLoader = false;
  movies: any;
  movieInfo: any;

  constructor(
    private fb: FormBuilder,
    private movieManagementService: MovieManagementService,
    private _location: Location,
    private toastr: ToastsManager,
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
    this.createForm();
    this.getAllMovies();
    this.getMovieInfoForEdit();
  }

  createForm() {
    this.addMovieForm = this.fb.group({
      'id': [''],
      'title': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ])
      ],
      'type': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ])
      ],
      "language": [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ])
      ],
      "censorRating": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'starRating': [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "duration": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "genre": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "writer": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "music": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "starring": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "director": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "releaseDate": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "synopsis": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'trailerLink': [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'sequence': [
        '',
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  getAllMovies() {
    this.movies = this.movieManagementService.getMovies();
  }

  validatenumber(e) {
    if (!RegEx.Numbers.test(`${e.key}`) && `${e.key}`.length === 1) {
      e.preventDefault();
    }
  }

  addMovie(addMovieForm) {
    console.log("addMovieForm ", addMovieForm);
    this.showLoader = true;
    if (addMovieForm.id) {
      const index = _.findIndex(this.movies, { id: addMovieForm['id'] });
      this.movies.splice(index, 1, addMovieForm);
      // this.movieManagementService.editMovie(this.vendors);
    } else {
      addMovieForm['id'] = Math.floor(Math.random() * 90000) + 10000;
      this.movieManagementService.addMovie(addMovieForm);
    }
    this.toastr.success('Sucessfully Done!', 'Sucess!');
    this.showLoader = false;
    this._location.back();
  }

  getMovieInfoForEdit() {
    if (this.movieId) {
      const movies = this.movieManagementService.getMovies();
      _.forEach(movies, (movie) => {
        if (movie.id === parseInt(this.movieId)) {
          this.movieInfo = movie;
          // this.addMovieForm.controls['id'].setValue(movie.id);
          // this.addMovieForm.controls['first_name'].setValue(movie.title);
          // this.addMovieForm.controls['last_name'].setValue(movie.last_name);
          // this.addMovieForm.controls['suffix'].setValue(movie.suffix);
          // this.addMovieForm.controls['company'].setValue(movie.company);
          // this.addMovieForm.controls['email'].setValue(movie.email);
          // this.addMovieForm.controls['phone'].setValue(movie.phoneNumber);
          // this.addMovieForm.controls['website'].setValue(movie.website);
          // this.addMovieForm.controls['listingFee'].setValue(movie.listingFee);
          // this.addMovieForm.controls['address'].setValue(movie.address);
          // this.addMovieForm.controls['city'].setValue(movie.city);
          // this.addMovieForm.controls['state'].setValue(movie.state);
          // this.addMovieForm.controls['country'].setValue(movie.country);
          // this.addMovieForm.controls['zip'].setValue(movie.zip);
          // this.addMovieForm.controls['status'].setValue(movie.status);
        }
      });
    }
  }

  deleteMovie() {
    this.deleteLoader = true;
    _.remove(this.movies, this.movieInfo);
    // this.vendorsService.editMovie(this.vendors);
    this.toastr.success('Sucessfully Deleted!', 'Sucess!');
    this.deleteLoader = false;
    this._location.back();
  }

}

