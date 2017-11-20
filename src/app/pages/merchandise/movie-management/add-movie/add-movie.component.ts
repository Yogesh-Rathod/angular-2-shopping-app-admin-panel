import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { IMyDpOptions } from 'mydatepicker';
import * as _ from 'lodash';
declare let $: any;

import { RegEx } from './../../../regular-expressions';
import { MovieManagementService } from 'app/services';
import { MovieDeletePopupComponent } from '../delete-popup/delete-popup.component';

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
  movieImages = [];
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    openSelectorOnInputClick: true
  };

  constructor(
    private modalService: NgbModal,
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
      this.movieManagementService.updateMovies(this.movies);
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
 console.log("this.movieInfo ", this.movieInfo);
          this.addMovieForm.controls['id'].setValue(movie.id);
          this.addMovieForm.controls['title'].setValue(movie.title);
          this.addMovieForm.controls['language'].setValue(movie.language);
          this.addMovieForm.controls['type'].setValue(movie.type);
          this.addMovieForm.controls['censorRating'].setValue(movie['censorRating']);
          this.addMovieForm.controls['starRating'].setValue(movie['starRating']);
          this.addMovieForm.controls['duration'].setValue(movie['duration']);
          this.addMovieForm.controls['genre'].setValue(movie['genre']);
          this.addMovieForm.controls['writer'].setValue(movie['writer']);
          this.addMovieForm.controls['music'].setValue(movie['music']);
          this.addMovieForm.controls['starring'].setValue(movie['starring']);
          this.addMovieForm.controls['director'].setValue(movie['director']);
          this.addMovieForm.controls['releaseDate'].setValue(movie['releaseDate']);
          this.addMovieForm.controls['synopsis'].setValue(movie['synopsis']);
          this.addMovieForm.controls['trailerLink'].setValue(movie['trailerLink']);
          this.addMovieForm.controls['sequence'].setValue(movie['sequence']);
        }
      });
    }
  }

  handleImageUpload(event, index) {
    const file = event.target.files[0];
    console.log("file ", file);
    if (file) {
      this.movieImages.push(file);
    } else {
      this.movieImages.splice(index, 1);
    }
    console.log("this.movieImages ", this.movieImages);
  }

  deleteMovie() {
    const activeModal = this.modalService.open(MovieDeletePopupComponent, { size: 'sm' });
    activeModal.componentInstance.modalText = 'vendor';

    activeModal.result.then((status) => {
      if (status) {
        this.deleteLoader = true;
        _.remove(this.movies, this.movieInfo);
        this.movieManagementService.updateMovies(this.movies);
        this.toastr.success('Sucessfully Deleted!', 'Sucess!');
        this.deleteLoader = false;
        this._location.back();
      }
    });
  }

}

