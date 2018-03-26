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

    p: number = 1;
    totalRecords: any = 1;
    showRecords: any = 50;
    searchTerm: any;
    movies: any;
    filteredMovies: any;
    deleteLoader: Number;
    bigLoader = false;
    selectAllCheckbox = false;
    showSelectedAction = false;
    deleteMultipleLoader = false;
    searchText: any;

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
        this.getAllMovies(this.showRecords);
    }

    getAllMovies(showRecords) {
        this.bigLoader = true;
        this.movieManagementService.getMovies('', 1, showRecords).
            then((moviesInfo) => {
                this.movies = moviesInfo.Data ? moviesInfo.Data.Records : [];
                this.totalRecords = moviesInfo.Data ? moviesInfo.Data.TotalRecords : 1;
                this.filteredMovies = this.movies;
                this.bigLoader = false;
            }).catch((error) => {
                if (error.Code === 500) {
                    this.toastr.error('Oops! Something went wrong. Please try again later.', 'Error!', { toastLife: 1500 });
                }
                this.bigLoader = false;
            });
    }

    showEntries(value) {
        this.showRecords = value;
        this.getAllMovies(this.showRecords);
        this.searchText = '';
    }

    pageChanged($event) {
        this.bigLoader = true;
        this.p = $event;
        this.movieManagementService.getMovies('', this.p, this.showRecords).
            then((moviesInfo) => {
                this.movies = moviesInfo.Data ? moviesInfo.Data.Records : [];
                this.totalRecords = moviesInfo.Data ? moviesInfo.Data.TotalRecords : 1;
                this.filteredMovies = this.movies;
                this.bigLoader = false;
            }).catch((error) => {
                this.bigLoader = false;
            })
    }

    searchMovie(searchTerm) {
        this.bigLoader = true;
        this.movieManagementService.getMovies(searchTerm, 1, this.showRecords).
            then((moviesInfo) => {
                this.movies = moviesInfo.Data ? moviesInfo.Data.Records : [];
                this.totalRecords = moviesInfo.Data ? moviesInfo.Data.TotalRecords : 1;
                this.filteredMovies = this.movies;
                this.bigLoader = false;
            }).catch((error) => {
                if (error.Code === 500) {
                    this.toastr.error('Oops! Something went wrong. Please try again later.', 'Error!', { toastLife: 1500 });
                }
            });
    }

    bulkUpload() {
        const activeModal = this.modalService.open(MovieBulkUploadComponent, { size: 'sm' });

        activeModal.result.then((status) => {
            if (status) {
                this.getAllMovies(this.showRecords);
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
        let moviesToDelete = [];
        const activeModal = this.modalService.open(DeleteMoviePopupComponent, { size: 'sm' });
        if (this.selectAllCheckbox) {
            activeModal.componentInstance.movieText = 'movies';
            _.forEach(this.filteredMovies, (item) => {
                moviesToDelete.push(
                    item.EventId
                );
                item.isChecked = false;
            });
            this.selectAllCheckbox = false;
        } else if (eventId) {
            activeModal.componentInstance.movieText = 'movie';
            moviesToDelete.push(
                eventId
            );
        } else {
            activeModal.componentInstance.movieText = 'movie';
            _.forEach(this.filteredMovies, (item) => {
                if (item.isChecked) {
                    moviesToDelete.push(
                        item.EventId
                    );
                    item.isChecked = false;
                }
            });
        }
        activeModal.result.then((status) => {
            this.showSelectedAction = false;
            if (status) {
                let moviesDelete = {
                    EventId: moviesToDelete,
                    IsActive: false
                };
                this.deleteMovies(moviesDelete);
            }
        });
    }

    deleteMovies(moviesToDelete) {
        this.deleteMultipleLoader = true;
        this.movieManagementService.deleteMovies(moviesToDelete).
        then((success) => {
            if (success.Success) {
                this.toastr.success('Movies successfully deleted.', 'Success!');
                this.getAllMovies(this.showRecords);
            }
            this.deleteMultipleLoader = false;
        }).catch((error) => {
            this.deleteMultipleLoader = false;
                this.toastr.error('Could not delete movies.', 'Error!');
            });
    }

}
