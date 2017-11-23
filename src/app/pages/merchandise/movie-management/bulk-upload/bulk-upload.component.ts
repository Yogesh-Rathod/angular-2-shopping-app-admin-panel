import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'lodash';

import { MovieManagementService, XlsxToJsonService } from 'app/services';

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

  constructor(
    private movieManagementService: MovieManagementService,
    private xlsxToJsonService: XlsxToJsonService,
    private toastr: ToastsManager,
  	private activeModal: NgbActiveModal
  	) { }

  ngOnInit() {}

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
      const someName = {
        "Title": movie['Title*'],
        "Type": movie['Type*'],
        "Language": movie['Language*'],
        "CensorRating": movie['Censor Rating*'],
        "StarRating": movie['Star Rating (1-5)'],
        "Duration": parseInt(movie['Duration* (in minutes)']),
        "Genre": movie['Genre*'],
        "Writer": movie['Writer*'],
        "Music": movie['Music'],
        "Starring": movie['Starring*'],
        "Director": movie['Director*'],
        "Synopsis": movie['Synopsis*'],
        "ReleaseDate": movie['Release Date* (dd/MM/yyyy)'],
        "ImageUrl": movie['Thumb Image Link*'],
        "PosterUrl": movie['Poster Image Link'],
        "LandscapeUrl": movie['Landscape Image Link'],
        "TrailerUrl": movie['Trailer Link'],
        "Sequence": movie['Sequence*'],
        "CreatedOn": new Date().toISOString(),
        "CreatedBy": 'Yogesh',
        'rbcnUrl': movie['Land scape Image Link_RBCN*']
      };
      this.movieInfo.push(someName);
    });
  }

  uploadFile(event) {
    event.preventDefault();
    this.showLoader = true;
    console.log("this.movieInfo ", this.movieInfo);
    if (this.movieInfo && this.movieInfo.length > 0) {
      this.movieManagementService.bulkUploadMovie(this.movieInfo).
        then((success) => {
          console.log("success ", success);
          this.toastr.success('Movie Sucessfully Added!', 'Success!');
          this.showLoader = false;
          this.closeModal(true);
        }).catch((error) => {
          console.log("error ", error);
          if (error.Code === 500) {
            this.toastr.error('Oops! Could not add movie.', 'Error!', { toastLife: 1500 });
          } else if (error.Code === 400) {
            // this.validationError = error.FailureReasons;
          }
          this.showLoader = false;
        });
    }
  }

  closeModal(status) {
    this.activeModal.close(status);
  }

}
