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
  bigLoader = false;
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
    // this.movies = this.movieManagementService.getMovies();
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
    this.bigLoader = true;
    if (this.movieId) {

      if (this.movieId) {
        this.movieManagementService.getMoviedetails(this.movieId).
          then((moviesInfo) => {
            console.log("moviesInfo ", moviesInfo);
            this.movieInfo = moviesInfo.Data.Event;
            this.updateMovieInfo(this.movieInfo);
            this.bigLoader = false;
          }).catch((error) => {
            console.log("error ", error);
            if (error.Code === 500) {
              this.toastr.error('Oops! Something went wrong. Please try again later.', 'Error!');
            }
            this.bigLoader = false;
          });
      }
    }
  }

  updateMovieInfo(movieInfo) {
    
    this.addMovieForm.controls['id'].setValue(movieInfo.EventId);
    this.addMovieForm.controls['title'].setValue(movieInfo.Title);
    this.addMovieForm.controls['language'].setValue(movieInfo.Language);
    this.addMovieForm.controls['type'].setValue(movieInfo.Type);
    this.addMovieForm.controls['censorRating'].setValue(movieInfo['CensorRating']);
    this.addMovieForm.controls['starRating'].setValue(movieInfo['StarRating']);
    this.addMovieForm.controls['duration'].setValue(movieInfo['Duration']);
    this.addMovieForm.controls['genre'].setValue(movieInfo['Genre']);
    this.addMovieForm.controls['writer'].setValue(movieInfo['Writer']);
    this.addMovieForm.controls['music'].setValue(movieInfo['Music']);
    this.addMovieForm.controls['starring'].setValue(movieInfo['Starring']);
    this.addMovieForm.controls['director'].setValue(movieInfo['Director']);
    // this.addMovieForm.controls['releaseDate'].setValue(movieInfo['ReleaseDate']);
    this.addMovieForm.controls['synopsis'].setValue(movieInfo['Synopsis']);
    this.addMovieForm.controls['trailerLink'].setValue(movieInfo['TrailerUrl']);
    this.addMovieForm.controls['sequence'].setValue(movieInfo['Sequence']);
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

