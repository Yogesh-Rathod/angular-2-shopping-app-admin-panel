import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
declare let $: any;

import { MovieManagementService } from 'app/services';
import { MovieBulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { Attribute } from '@angular/core/src/metadata/di';
import { DeleteMoviePopupComponent } from './delete-popup/delete-popup.component';

@Component({
    selector: 'app-movie-management',
    templateUrl: './movie-management.component.html',
    styleUrls: ['./movie-management.component.scss']
})
export class MovieManagementComponent implements OnInit {

    searchTerm: any;
    movies: any;
    filteredMovies: any;
    deleteLoader: Number;
    bigLoader = false;
    selectAllCheckbox = false;
    showSelectedAction = false;
    deleteMultipleLoader = false;

    constructor(
        private modalService: NgbModal,
        public toastr: ToastsManager,
        private fb: FormBuilder,
        private movieManagementService: MovieManagementService) {
    }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.getAllMovies();
    }

    getAllMovies() {
        this.bigLoader = true;
        this.movieManagementService.getMovies().
            then((moviesInfo) => {
                console.log("movies ", moviesInfo);
                this.movies = moviesInfo.Data.Records;
                this.filteredMovies = this.movies;
                this.bigLoader = false;
            }).catch((error) => {
                console.log("error ", error);
                if (error.Code === 500) {
                    this.toastr.error('Oops! Something went wrong. Please try again later.', 'Error!', { toastLife: 1500 });
                }
                this.bigLoader = false;
            });
    }

    searchMovie(searchTerm) {
        this.filteredMovies = this.movies.filter((item) => {
            const caseInsensitiveSearch = new RegExp(`${searchTerm.trim()}`, "i");
            return caseInsensitiveSearch.test(item.Title) || caseInsensitiveSearch.test(item.Language) || caseInsensitiveSearch.test(item.Type);
        });
    }

    bulkUpload() {
        const activeModal = this.modalService.open(MovieBulkUploadComponent, { size: 'sm' });

        activeModal.result.then((status) => {
            console.log("status ", status);
            if (status) {
                this.getAllMovies();
            }
        });
    }

    selectAll(e) {
        if (e.target.checked) {
            this.selectAllCheckbox = true;
            _.forEach(this.filteredMovies, (item) => {
                item.isChecked = true;
            });
            this.showSelectedAction = true;
        } else {
            // this.noActionSelected = false;
            this.selectAllCheckbox = false;
            _.forEach(this.filteredMovies, (item) => {
                item.isChecked = false;
            });
            this.showSelectedAction = false;
        }
    }

    checkBoxSelected(e, item) {
        this.selectAllCheckbox = false;
        if (e.target.checked) {
            item.isChecked = true;
        } else {
            item.isChecked = false;
        }

        let isCheckedArray = [];

        _.forEach(this.filteredMovies, (item) => {
            if (item.isChecked) {
                this.showSelectedAction = true;
                isCheckedArray.push(item);
            }
        });

        if (isCheckedArray.length === 0) {
            this.showSelectedAction = false;
        }

    }

    deleteMovie(eventId?) {
        console.log("eventId ", eventId);
        let moviesToDelete = [];
        const activeModal = this.modalService.open(DeleteMoviePopupComponent, { size: 'sm' });
        if (this.selectAllCheckbox) {
            activeModal.componentInstance.movieText = 'movies';
            _.forEach(this.filteredMovies, (item) => {
                moviesToDelete.push({
                    movieId: item.EventId
                });
                item.isChecked = false;
            });
            this.selectAllCheckbox = false;
        } else {
            activeModal.componentInstance.movieText = 'movie';
            _.forEach(this.filteredMovies, (item) => {
                if (item.isChecked) {
                    moviesToDelete.push({
                        movieId: item.EventId
                    });
                    item.isChecked = false;
                }
            });
        }
        activeModal.result.then((status) => {
            this.showSelectedAction = false;
            if (status) {
                this.deleteMultipleLoader = true;
                // this.getAllMovies();
            }
        });
    }

}
