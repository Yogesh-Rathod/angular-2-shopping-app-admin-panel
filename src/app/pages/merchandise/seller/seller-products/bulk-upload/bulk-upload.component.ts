import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'lodash';

import { ProductsService, XlsxToJsonService } from 'app/services';

@Component({
    selector: 'app-bulk-upload',
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.scss']
})
export class SellsBulkUploadComponent implements OnInit {

    submitDisabled = true;
    showUploadError = false;
    showLoader = false;
    productsInfo: any;
    result: any;
    blankFileError = false;
    validationError: any;

    constructor(
        private toastr: ToastsManager,
        private productsService: ProductsService,
        private activeModal: NgbActiveModal,
        private xlsxToJsonService: XlsxToJsonService,
    ) { }

    ngOnInit() {}

    handleFile(event) {
        // this.validationError = null;
        // this.blankFileError = false;
        let file = event.target.files[0];
        if (file) {
            this.showLoader = true;
            let objectkey = '';
            this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
                if (data['sheets']) {
                    const sheetKey = Object.keys(data['sheets']);
                    this.result = data['sheets'][sheetKey[0]];
                    console.log("this.result ", this.result);
                    if (this.result && this.result.length > 0) {
                        // this.convertJSONResponse(this.result);
                        this.productsInfo = this.result;
                        this.showLoader = false;
                        this.submitDisabled = false;
                    } else {
                        this.blankFileError = true;
                        this.showLoader = false;
                    }
                }
            });
        } else {
            this.productsInfo = [];
            this.submitDisabled = true;
        }
    }

    // convertJSONResponse(result) {
    //     console.log("result ", result);
    //     _.forEach(result, (movie) => {
    //         const productsInformation = {
    //             "Title": movie['Title*'],
    //             "Type": movie['Type*'],
    //             "Language": movie['Language*'],
    //             "CensorRating": movie['Censor Rating*'],
    //             "StarRating": movie['Star Rating (1-5)'],
    //             "Duration": parseInt(movie['Duration* (in minutes)']),
    //             "Genre": movie['Genre*'],
    //             "Writer": movie['Writer*'],
    //             "Music": movie['Music'],
    //             "Starring": movie['Starring*'],
    //             "Director": movie['Director*'],
    //             "Synopsis": movie['Synopsis*'],
    //             "ReleaseDate": movie['Release Date* (dd/MM/yyyy)'],
    //             "ImageUrl": movie['Thumb Image Link*'],
    //             "PosterUrl": movie['Poster Image Link'],
    //             "LandscapeUrl": movie['Landscape Image Link'],
    //             "TrailerUrl": movie['Trailer Link'],
    //             "Sequence": movie['Sequence*'],
    //             'RBCNimageUrl': movie['Land scape Image Link_RBCN*']
    //         };
    //         this.productsInfo.push(productsInformation);
    //     });
    // }

    uploadFile(event) {
        event.preventDefault();
        this.showLoader = true;
        if (this.productsInfo && this.productsInfo.length > 0) {
            console.log("if ");
            this.productsService.addProduct(this.productsInfo).
                then((success) => {
                    console.log("success ", success);
                    if (success.Code === 200) {
                        this.toastr.success('Product sucessfully sent for approval!', 'Success!');
                        this.showLoader = false;
                        this.closeModal(true);
                    } else if (success.Code === 500) {
                        this.showLoader = false;
                        this.toastr.error('Oops! Could not upload products.', 'Error!');
                    }
                }).catch((error) => {
                    console.log("error ", error);
                    if (error.Code === 500) {
                        this.toastr.error('Oops! Could not add movie.', 'Error!');
                    } else if (error.Code === 400) {
                        this.validationError = error.FailureReasons;
                    }
                    this.showLoader = false;
                });
        }
    }

    closeModal(status) {
        this.activeModal.close();
    }

}
