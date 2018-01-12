import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
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
    unmappedMovies: any;
    unmappedLoader = false;
    mappedMovies = [];
    mapMovieLoader = false;
    mappedLoader = false;

    constructor(
        private location: Location,
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
        this.getMovieInfo();
        this.getUnMappedMovies();
        this.getAlreadyMappedMovies();
    }

    initTooltip() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
    }

    getMovieInfo() {
        this.bigLoader = true;
        if (this.movieId) {
            this.movieManagementService.getMoviedetails(this.movieId).
                then((moviesInfo) => {
                    // console.log("moviesInfo ", moviesInfo);
                    this.movieInfo = moviesInfo.Data;
                    this.bigLoader = false;
                    this.initTooltip();
                }).catch((error) => {
                    // console.log("getMoviedetails error ", error);
                    if (error.Code === 500) {
                        this.toastr.error('Oops! Something went wrong. Please try again later.', 'Error!', { toastLife: 1500 });
                        this.location.back();
                    }
                    this.bigLoader = false;
                    this.initTooltip();
                });
        }
    }

    getUnMappedMovies() {
        this.unmappedLoader = true;
        if (this.movieId) {
            this.movieManagementService.getUnmappedMovies().
                then((unmappedMovies) => {
                    // console.log("unmappedMovies ", unmappedMovies);
                    this.unmappedMovies = unmappedMovies.Data.Records;
                    this.unmappedLoader = false;
                }).catch((error) => {
                    // console.log("getUnmappedMovies error ", error);
                    if (error.Code === 500) {
                        this.toastr.error('Oops! Something went wrong. Please try again later.', 'Error!', { toastLife: 1500 });
                        this.location.back();
                    }
                    this.unmappedLoader = false;
                });
        }
    }

    getAlreadyMappedMovies() {
        this.mappedLoader = true;
        if (this.movieId) {
            this.movieManagementService.geAlreadyMappedMovies(this.movieId).
                then((mappedMovies) => {
                    this.mappedMovies = mappedMovies.Data.ProviderMovies;
                    // console.log("this.mappedMovies ", this.mappedMovies);
                    this.mappedLoader = false;
                }).catch((error) => {
                    // console.log("geAlreadyMappedMovies error ", error);
                    if (error.Code === 500) {
                        this.location.back();
                        // this.toastr.error('Oops! Something went wrong. Please try again later.', 'Error!', { toastLife: 1500 });
                    }
                    this.mappedLoader = false;
                });
        }
    }

    selectAll(e) {
        if (e.target.checked) {
            this.selectAllCheckboxUnMap = true;
            _.forEach(this.unmappedMovies, (item) => {
                item.isChecked = true;
            });
            this.showMappingbuttons.map = true;
        } else {
            this.selectAllCheckboxUnMap = false;
            _.forEach(this.unmappedMovies, (item) => {
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
        this.selectAllCheckboxMapped = false;

        if (e.target.checked) {
            item.isChecked = true;
        } else {
            item.isChecked = false;
        }

        let unmappedItemsArray = [];
        let mappedItemsArray = [];

        _.forEach(this.unmappedMovies, (item) => {
            if (item.isChecked) {
                this.showMappingbuttons.map = true;
                unmappedItemsArray.push(item);
            }
        });

        _.forEach(this.mappedMovies, (item) => {
            if (item.isChecked) {
                this.showMappingbuttons.unmap = true;
                mappedItemsArray.push(item);
            }
        });

        if (unmappedItemsArray.length === 0) {
            this.showMappingbuttons.map = false;
        }

        if (mappedItemsArray.length === 0) {
            this.showMappingbuttons.unmap = false;
        }
    }

    mapAMovie() {
        if (this.selectAllCheckboxUnMap) {
            this.mapAllMovies();
        } else {
            this.mapSelectedMovies();
        }
    }

    mapAllMovies() {
        this.mapMovieLoader = true;
        let moviesToMap = [];
        _.forEach(this.unmappedMovies, (item) => {
            moviesToMap.push(item.Id);
        });
        const movieInfo = {
            "EventMasterId": this.movieInfo.EventId,
            "ProviderMovieIds": moviesToMap
        };
        this.movieManagementService.mapMovies(movieInfo).
            then((successFullyMapped) => {
                // console.log("successFullyMapped ", successFullyMapped);
                this.toastr.success('Movie Successfully Mapped!', 'Success!', { toastLife: 3000 });
                this.getUnMappedMovies();
                this.getAlreadyMappedMovies();
                this.showMappingbuttons.map = false;
                this.selectAllCheckboxUnMap = false;
                this.selectAllCheckboxMapped = false;
                this.mapMovieLoader = false;
            }).catch((errorInMapping) => {
                // console.log("mapMovies errorInMapping ", errorInMapping);
                this.mapMovieLoader = false;
                this.toastr.error('Movie can not be mapped!', 'Error!', { toastLife: 2000 });
                this.showMappingbuttons.map = false;
                this.selectAllCheckboxUnMap = false;
            });
    }

    mapSelectedMovies() {
        this.mapMovieLoader = true;
        let moviesToMap = [];
        _.forEach(this.unmappedMovies, (item) => {
            if (item.isChecked) {
                moviesToMap.push(item.Id);
            }
        });
        _.forEach(this.mappedMovies, (item) => {
            moviesToMap.push(item.Id);
        });
        const movieInfo = {
            "EventMasterId": this.movieInfo.EventId,
            "ProviderMovieIds": moviesToMap
        };
        if (moviesToMap.length > 0) {
            this.movieManagementService.mapMovies(movieInfo).
                then((successFullyMapped) => {
                // console.log("successFullyMapped ", successFullyMapped);
                this.toastr.success('Movie Successfully Mapped!', 'Success!', { toastLife: 3000 });
                this.getUnMappedMovies();
                this.getAlreadyMappedMovies();
                this.showMappingbuttons.map = false;
                this.selectAllCheckboxUnMap = false;
                this.mapMovieLoader = false;
                }).catch((errorInMapping) => {
                // console.log("mapMovies errorInMapping ", errorInMapping);
                this.mapMovieLoader = false;
                this.toastr.error('Movie can not be mapped!', 'Error!', { toastLife: 2000 });
                this.showMappingbuttons.map = false;
                this.selectAllCheckboxUnMap = false;
                });
        }
    }


    unMapAMovie() {
        if (this.selectAllCheckboxMapped) {
            this.unMapAllMovies();
        } else {
            this.unMapSelectedMovies();
        }
    }

    unMapAllMovies() {
        this.mapMovieLoader = true;
        const movieInfo = {
            "EventMasterId": this.movieInfo.EventId,
            "ProviderMovieIds": []
        };
        this.movieManagementService.mapMovies(movieInfo).
            then((successFullyMapped) => {
                // console.log("successFullyMapped ", successFullyMapped);
                this.toastr.success('Movie Successfully Unmapped!', 'Success!', { toastLife: 3000 });
                this.getUnMappedMovies();
                this.getAlreadyMappedMovies();
                this.showMappingbuttons.unmap = false;
                this.selectAllCheckboxUnMap = false;
                this.selectAllCheckboxMapped = false;
                this.mapMovieLoader = false;
            }).catch((errorInMapping) => {
                // console.log("mapMovies errorInMapping ", errorInMapping);
                this.mapMovieLoader = false;
                this.toastr.error('Movie can not be mapped!', 'Error!', { toastLife: 2000 });
                this.showMappingbuttons.map = false;
                this.selectAllCheckboxUnMap = false;
            });
    }

    unMapSelectedMovies() {
        this.mapMovieLoader = true;
        let moviesToUnMap = [];
        // Send All Movies except movie to unmap
        _.forEach(this.mappedMovies, (item) => {
            if (!item.isChecked) {
                moviesToUnMap.push(item.Id);
            }
        });
        const movieInfo = {
            "EventMasterId": this.movieInfo.EventId,
            "ProviderMovieIds": moviesToUnMap
        };
        this.movieManagementService.mapMovies(movieInfo).
            then((successFullyUnMapped) => {
                // console.log("successFullyUnMapped ", successFullyUnMapped);
                this.toastr.success('Movie Successfully Unmapped!', 'Success!', { toastLife: 3000 });
                this.getUnMappedMovies();
                this.getAlreadyMappedMovies();
                this.showMappingbuttons.unmap = false;
                this.selectAllCheckboxUnMap = false;
                this.mapMovieLoader = false;
            }).catch((errorInUnMapping) => {
                // console.log("errorInUnMapping errorInMapping ", errorInUnMapping);
                this.mapMovieLoader = false;
                this.toastr.error('Movie can not be unmapped!', 'Error!', { toastLife: 2000 });
                this.showMappingbuttons.unmap = false;
                this.selectAllCheckboxUnMap = false;
            });
    }

}
