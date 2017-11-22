import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
  movieInfo: any;
  validationError: any;
  blankFileError = false;

  constructor(
    private movieManagementService: MovieManagementService,
    private xlsxToJsonService: XlsxToJsonService,
    private toastr: ToastsManager,
  	private activeModal: NgbActiveModal
  	) { }

  ngOnInit() {

  }

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
      this.movieInfo = null;
      this.submitDisabled = true;
    }
  }

  convertJSONResponse(result) {
    let firstResult = result[0];
    this.movieInfo = {
      "Title": firstResult['Title*'],
      "Type": firstResult['Type*'],
      "Language": firstResult['Language*'],
      "CensorRating": firstResult['Censor Rating*'],
      "StarRating": firstResult['Star Rating (1-5)'],
      "Duration": firstResult['Duration* (in minutes)'],
      "Genre": firstResult['Genre*'],
      "Writer": firstResult['Writer*'],
      "Music": firstResult['Music'],
      "Starring": firstResult['Starring*'],
      "Director": firstResult['Director*'],
      "Synopsis": firstResult['Synopsis*'],
      "ReleaseDate": firstResult['Release Date* (dd/MM/yyyy)'],
      "ImageUrl": firstResult['Thumb Image Link*'],
      "PosterUrl": firstResult['Poster Image Link'],
      "LandscapeUrl": firstResult['Landscape Image Link'],
      "TrailerUrl": firstResult['Trailer Link'],
      "Sequence": firstResult['Sequence*'],
      // "CreatedOn": new Date().toISOString(),
      "CreatedBy": 'Yogesh',
      'rbcnUrl': firstResult['Land scape Image Link_RBCN*']
    }
    console.log("movieInfo ", this.movieInfo);
  }

  uploadFile(event) {
    event.preventDefault();
    console.log("movieInfo ", this.movieInfo);
    if (this.movieInfo) {
      this.movieManagementService.addMovie(this.movieInfo).
        then((success) => {
          console.log("success ", success);
          this.toastr.success('Movie Sucessfully Added!', 'Success!');
          this.showLoader = false;
          this.closeModal();
        }).catch((error) => {
          console.log("error ", error);
          if (error.Code === 500) {
            this.toastr.error('Oops! Could not add movie.', 'Error!', { toastLife: 1500 });
          } else if (error.Code === 400) {
            this.validationError = error.FailureReasons;
          }
          this.showLoader = false;
        });
    }
  }

  closeModal() {
  	this.activeModal.close();
  }

}
