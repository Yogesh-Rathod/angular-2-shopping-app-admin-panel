import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'lodash';

import { MovieManagementService, XlsxToJsonService } from 'app/services';
import { AppStateManagementService } from 'users_modules/services';

@Component({
    selector: 'app-bulk-upload',
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.scss']
})
export class MovieBulkUploadComponent implements OnInit {

    submitDisabled = true;
    showLoader = false;
    result: any;
    movieInfo = [];
    validationError: any;
    blankFileError = false;
    userInfo: any;

    constructor(
        private movieManagementService: MovieManagementService,
        private appStateManagementService: AppStateManagementService,
        private xlsxToJsonService: XlsxToJsonService,
        private toastr: ToastsManager,
        private activeModal: NgbActiveModal
    ) {
        this.appStateManagementService.retrieveAppStateCK('MERCHANDISE.userData').
            then((userInfo) => {
                this.userInfo = JSON.parse(userInfo);
            }).catch((error) => {
                this.userInfo = {
                    username: 'Unknown User'
                }
            });
    }

    ngOnInit() { }

    handleFile(event) {
        this.validationError = null;
        this.blankFileError = false;
        let file = event.target.files[0];
        if (file) {
            this.showLoader = true;
            let objectkey = '';
            this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
                if (data['sheets']) {
                    const sheetKey = Object.keys(data['sheets']);
                    this.result = data['sheets'][sheetKey[0]];
                    if (this.result && this.result.length > 0) {
                        this.convertJSONResponse(this.result);
                        this.showLoader = false;
                        this.submitDisabled = false;
                    } else {
                        this.blankFileError = true;
                        this.showLoader = false;
                    }
                }
            });
        } else {
            this.movieInfo = [];
            this.submitDisabled = true;
        }
    }

    convertJSONResponse(result) {
        _.forEach(result, (movie) => {
            const movieInformation = {
                "Title": movie['Title*'] ? encodeURIComponent(movie['Title*']) : '',
                "Type": movie['Type*'] ? encodeURIComponent(movie['Type*']) : '',
                "Language": movie['Language*'] ? encodeURIComponent(movie['Language*']) : '',
                "CensorRating": movie['Censor Rating*'] ? encodeURIComponent(movie['Censor Rating*']) : '',
                "StarRating": movie['Star Rating (1-5)'],
                "Duration": parseInt(movie['Duration* (in minutes)']),
                "Genre": movie['Genre*'] ? encodeURIComponent(movie['Genre*']) : '',
                "Writer": movie['Writer*'] ? encodeURIComponent(movie['Writer*']) : '',
                "Music": movie['Music'] ? encodeURIComponent(movie['Music']) : '',
                "Starring": movie['Starring*'] ? encodeURIComponent(movie['Starring*']) : '',
                "Director": movie['Director*'] ? encodeURIComponent(movie['Director*']) : '',
                "Synopsis": movie['Synopsis*'] ? encodeURIComponent(movie['Synopsis*']) : '',
                "ReleaseDate": movie['Release Date* (dd/MM/yyyy)'],
                "ImageUrl": movie['Thumb Image Link*'] ? encodeURIComponent(movie['Thumb Image Link*']) : '',
                "PosterUrl": movie['Poster Image Link'] ? encodeURIComponent(movie['Poster Image Link']) : '',
                "LandscapeUrl": movie['Landscape Image Link'] ? encodeURIComponent(movie['Landscape Image Link']) : '',
                "TrailerUrl": movie['Trailer Link'] ? encodeURIComponent(movie['Trailer Link']) : '',
                "Sequence": movie['Sequence*'] ? encodeURIComponent(movie['Sequence*']) : '',
                "CreatedOn": new Date().toISOString(),
                "CreatedBy": this.userInfo.username,
                'RBCNimageUrl': movie['Land scape Image Link_RBCN*'] ? encodeURIComponent(movie['Land scape Image Link_RBCN*']) : ''
            };
            this.movieInfo.push(movieInformation);
        });
    }


    uploadFile(event) {
        event.preventDefault();
        this.showLoader = true;
        if (this.movieInfo && this.movieInfo.length > 0) {
            this.movieManagementService.bulkUploadMovie(this.movieInfo).
                then((success) => {
                    if (success.Code === 200) {
                        this.toastr.success('Movie Sucessfully Added!', 'Success!');
                        this.showLoader = false;
                        this.closeModal(true);
                    } else if (success.Code === 500) {
                        this.showLoader = false;
                        this.validationError = success.FailureReasons;
                        this.toastr.error('Oops! Could not add movie.', 'Error!', { toastLife: 1500 });
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

    closeModal(status) {
        this.activeModal.close(status);
    }

}
