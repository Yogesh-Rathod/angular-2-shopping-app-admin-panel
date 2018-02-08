import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
declare let $: any;

import { MovieManagementService } from 'app/services';
import { MovieBulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { Attribute } from '@angular/core/src/metadata/di';

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

    deleteMovie(eventId) {
        console.log("eventId ", eventId);
    }

}
