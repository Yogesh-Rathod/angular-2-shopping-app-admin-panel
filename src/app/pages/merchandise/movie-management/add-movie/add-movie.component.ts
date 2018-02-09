import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { IMyDpOptions } from 'mydatepicker';
import { CookieService } from 'ngx-cookie';
import * as _ from 'lodash';
declare let $: any;

import { RegEx } from './../../../regular-expressions';
import { MovieManagementService } from 'app/services';
import { AppStateManagementService } from 'users_modules/services';
import { log } from 'util';

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
    validationError: any;
    userInfo: any;
    base64textString: any;
    formImageSelected: any;

    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
        private movieManagementService: MovieManagementService,
        private appStateManagementService: AppStateManagementService,
        private _location: Location,
        private toastr: ToastsManager,
        private route: ActivatedRoute,
        private router: Router,
        private cookieService: CookieService
    ) {
        this.route.params.subscribe(params =>
            this.movieId = params['movieId']
        )
        this.appStateManagementService.retrieveAppStateCK('MERCHANDISE.userData').
            then((userInfo) => {
                this.userInfo = JSON.parse(userInfo);
            }).catch((error) => {
                this.userInfo = {
                    username: 'Unknown User'
                }
            });
    }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.createForm();
        if (this.movieId) {
            this.getMovieInfoForEdit();
        }
    }

    createForm() {
        this.addMovieForm = this.fb.group({
            'id': [''],
            'Title': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(100)
                ])
            ],
            'Type': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(100)
                ])
            ],
            "Language": [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100)
                ])
            ],
            "CensorRating": [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(20)
                ])
            ],
            'StarRating': [
                '',
                Validators.compose([
                    Validators.pattern(RegEx.starRating)
                ])
            ],
            "Duration": [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(RegEx.onlyNumber)
                ])
            ],
            "Genre": [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            "Writer": [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            "Music": [''],
            "Starring": [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            "Director": [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            "ReleaseDate": [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            "Synopsis": [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            'TrailerUrl': [''],
            'Sequence': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(RegEx.onlyNumber)
                ])
            ],
            'ImageUrl': [
                '',
                Validators.compose([
                    // Validators.required
                ])
            ],
            'PosterUrl': [
                '',
                Validators.compose([
                    // Validators.required
                ])
            ],
            'LandscapeUrl': [
                '',
                Validators.compose([
                    // Validators.required
                ])
            ],
            'RBCNimageUrl': [
                '',
                Validators.compose([
                    // Validators.required
                ])
            ],
            'Image': [
                '',
                Validators.compose([
                    // Validators.required
                ])
            ],
            'Poster': [
                '',
                Validators.compose([
                    // Validators.required
                ])
            ],
            'Landscape': [
                '',
                Validators.compose([
                    // Validators.required
                ])
            ],
            'RBCNimage': [
                '',
                Validators.compose([
                    // Validators.required
                ])
            ],
            'CreatedOn': [new Date().toISOString()],
            'CreatedBy': ['']
        });
        if (!this.movieId) {
            this.uploadTypeSelected('image');
        }
    }

    validatenumber(e) {
        if (!RegEx.Numbers.test(`${e.key}`) && `${e.key}`.length === 1) {
            e.preventDefault();
        }
    }

    uploadTypeSelected(uploadType) {
        if (!this.movieId) {
            if (uploadType === 'image') {
                this.addMovieForm.get('Image').setValidators([Validators.required]);
                this.addMovieForm.get('Poster').setValidators([Validators.required]);
                this.addMovieForm.get('Landscape').setValidators([Validators.required]);
                this.addMovieForm.get('RBCNimage').setValidators([Validators.required]);
                this.addMovieForm.get('ImageUrl').setValidators(null);
                this.addMovieForm.get('PosterUrl').setValidators(null);
                this.addMovieForm.get('LandscapeUrl').setValidators(null);
                this.addMovieForm.get('RBCNimageUrl').setValidators(null);
                this.updateValidation();
            } else {
                this.addMovieForm.get('Image').setValue('');
                this.addMovieForm.get('Poster').setValue('');
                this.addMovieForm.get('Landscape').setValue('');
                this.addMovieForm.get('Poster').setValue('');
                this.addMovieForm.get('Image').setValidators(null);
                this.addMovieForm.get('Poster').setValidators(null);
                this.addMovieForm.get('Landscape').setValidators(null);
                this.addMovieForm.get('RBCNimage').setValidators(null);
                this.addMovieForm.get('ImageUrl').setValidators([Validators.required]);
                this.addMovieForm.get('PosterUrl').setValidators([Validators.required]);
                this.addMovieForm.get('LandscapeUrl').setValidators([Validators.required]);
                this.addMovieForm.get('RBCNimageUrl').setValidators([Validators.required]);
                this.updateValidation();
            }
        }
    }

    updateValidation() {
        const invalid = [];
        const controls = this.addMovieForm.controls;
        for (const name in controls) {
            controls[name].updateValueAndValidity();
        }
    }

    handleFile(evt, Image) {
        const files = evt.target.files;
        const file = files[0];
        this.formImageSelected = Image;
        if (files && file) {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                this.addMovieForm.controls[Image].setValue(`${reader.result.split(',')[1]}`);
            };
        } else {
            this.addMovieForm.controls[Image].setValue('');
        }
    }

    addMovie(addMovieForm) {
        this.validationError = null;
        this.showLoader = true;
        addMovieForm['ReleaseDate'] = new Date(`
        ${addMovieForm['ReleaseDate'].date.month}/
        ${addMovieForm['ReleaseDate'].date.day}/
        ${addMovieForm['ReleaseDate'].date.year}
        `);
        if (addMovieForm.id) {
            addMovieForm.ModifiedOn = new Date().toISOString();
            addMovieForm.ModifiedBy = this.userInfo.username;
            this.movieManagementService.updateMovie(addMovieForm, addMovieForm.id).
                then((success) => {
                    if (success.Success) {
                        this.toastr.success('Movie Sucessfully Updated!', 'Success!');
                        this._location.back();
                    } else {
                        this.toastr.error('Oops! Could not update movie.', 'Error!', { toastLife: 1500 });
                        this.validationError = success.FailureReasons;
                    }
                    this.showLoader = false;
                }).catch((error) => {
                    if (error.Code === 500) {
                        this.toastr.error('Oops! Could not add movie.', 'Error!', { toastLife: 1500 });
                    } else if (error.Code === 400) {
                        this.validationError = error.FailureReasons;
                    }
                    this.showLoader = false;
                });
        } else {
            addMovieForm.CreatedBy = this.userInfo.username;
            delete addMovieForm['id'];
            this.movieManagementService.addMovie(addMovieForm).
                then((success) => {
                    if (success.Code === 200) {
                        this.toastr.success('Movie Sucessfully Added!', 'Success!');
                        this.showLoader = false;
                        this._location.back();
                    } else if (success.Code === 500) {
                        this.showLoader = false;
                        this.toastr.error('Oops! Could not add movie.', 'Error!', { toastLife: 1500 });
                        this.validationError = success.FailureReasons;
                    }
                }).catch((error) => {
                    if (error.Code === 500) {
                        this.toastr.error('Oops! Could not add movie.', 'Error!', { toastLife: 1500 });
                    } else if (error.Code === 400) {
                        this.validationError = error.FailureReasons;
                    }
                    this.showLoader = false;
                });
        }
    }

    getMovieInfoForEdit() {
        this.bigLoader = true;
        this.movieManagementService.getMoviedetails(this.movieId).
            then((moviesInfo) => {
                console.log("moviesInfo ", moviesInfo);
                this.movieInfo = moviesInfo.Data;
                this.updateMovieInfo(this.movieInfo);
                this.bigLoader = false;
            }).catch((error) => {
                console.log("error ", error);
                if (error.Code === 500) {
                    this.toastr.error('Oops! Something went wrong. Please try again later.', 'Error!', { toastLife: 1500 });
                    this._location.back();
                }
                this.bigLoader = false;
            });
    }

    updateMovieInfo(movieInfo) {
        const releaseFullDate = new Date(movieInfo['ReleaseDate']+'.00Z');
        console.log("releaseFullDate ", releaseFullDate);
        this.addMovieForm.controls['id'].setValue(movieInfo.EventId);
        this.addMovieForm.controls['Title'].setValue(movieInfo.Title);
        this.addMovieForm.controls['Type'].setValue(movieInfo.Type);
        this.addMovieForm.controls['Language'].setValue(movieInfo.Language);
        this.addMovieForm.controls['CensorRating'].setValue(movieInfo['CensorRating']);
        this.addMovieForm.controls['StarRating'].setValue(movieInfo['StarRating']);
        this.addMovieForm.controls['Duration'].setValue(movieInfo['Duration']);
        this.addMovieForm.controls['Genre'].setValue(movieInfo['Genre']);
        this.addMovieForm.controls['Writer'].setValue(movieInfo['Writer']);
        this.addMovieForm.controls['Music'].setValue(movieInfo['Music']);
        this.addMovieForm.controls['Starring'].setValue(movieInfo['Starring']);
        this.addMovieForm.controls['Director'].setValue(movieInfo['Director']);
        this.addMovieForm.controls['ReleaseDate'].setValue({
            date: {
                year: releaseFullDate.getFullYear(),
                day: releaseFullDate.getDate(),
                month: releaseFullDate.getMonth() + 1,
            }
        });
        this.addMovieForm.controls['Synopsis'].setValue(movieInfo['Synopsis']);
        this.addMovieForm.controls['TrailerUrl'].setValue(movieInfo['TrailerUrl']);
        this.addMovieForm.controls['Sequence'].setValue(movieInfo['Sequence']);
        // this.addMovieForm.controls['Image'].setValue(movieInfo['ImageUrl']);
        // this.addMovieForm.controls['Poster'].setValue(movieInfo['PosterUrl']);
        // this.addMovieForm.controls['Landscape'].setValue(movieInfo['LandscapeUrl']);
        // this.addMovieForm.controls['RBCNimage'].setValue(movieInfo['RBCNimageUrl']);
        this.addMovieForm.controls['CreatedOn'].setValue(movieInfo['CreatedOn']);
        this.addMovieForm.controls['CreatedBy'].setValue(movieInfo['CreatedBy']);
        this.addMovieForm.get('ImageUrl').setValue(movieInfo['ImageUrl']);
        this.addMovieForm.get('PosterUrl').setValue(movieInfo['PosterUrl']);
        this.addMovieForm.get('LandscapeUrl').setValue(movieInfo['LandscapeUrl']);
        this.addMovieForm.get('RBCNimageUrl').setValue(movieInfo['RBCNimageUrl']);
        this.checkFormValidation();
    }

    checkFormValidation() {
        for (var i in this.addMovieForm.controls) {
            this.addMovieForm.controls[i].markAsTouched();
        }
    }

}

