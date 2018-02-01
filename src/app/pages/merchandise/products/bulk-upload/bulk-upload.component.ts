import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'lodash';

import { ProductsService, XlsxToJsonService, JsonToExcelService } from 'app/services';

@Component({
    selector: 'app-bulk-upload',
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.scss']
})
export class ProductsBulkUploadComponent implements OnInit {
    errorData = [];
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
        private jsonToExcelService:JsonToExcelService,
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

    uploadFile(event, action) {
        event.preventDefault();
        this.showLoader = true;
        if (this.productsInfo && this.productsInfo.length > 0) {
            if (action === 'save') {
                this.productsService.editOperationProduct(this.productsInfo, 'Operations').
                    then((success) => {
                        console.log("addProduct success ", success);
                        if (success.Code === 200) {
                            this.toastr.success('Product sucessfully saved in draft', 'Success!');
                            this.closeModal(true);
                        } else if (success.Code === 500) {
                            this.errorData = success.Data;
                            this.toastr.error('Oops! Could not upload products.', 'Error!');
                        }
                        this.showLoader = false;
                    }).catch((error) => {
                        console.log("error ", error);
                        if (error.Code === 500) {
                            this.toastr.error('Oops! Could not upload products.', 'Error!');
                        } else if (error.Code === 400) {
                            this.validationError = error.FailureReasons;
                        }
                        this.showLoader = false;
                    });
            } else if (action === 'submit') {
                this.productsService.confirmOperationProduct(this.productsInfo, 'Operations').
                    then((success) => {
                        console.log("sendproductForApproval success ", success);
                        if (success.Code === 200) {
                            this.toastr.success('Product sucessfully sent for approval!', 'Success!');
                            this.closeModal(true);
                        } else if (success.Code === 500) {
                            this.errorData = success.Data;
                            this.toastr.error('Oops! Could not upload products.', 'Error!');
                        }
                        this.showLoader = false;
                    }).catch((error) => {
                        console.log("error ", error);
                        if (error.Code === 500) {
                            this.toastr.error('Oops! Could not upload products.', 'Error!');
                        } else if (error.Code === 400) {
                            this.validationError = error.FailureReasons;
                        }
                        this.showLoader = false;
                    });
            }
        }
    }

    downloadFile(){
        this.jsonToExcelService.exportAsExcelFile(this.errorData,'products')
    }

    closeModal(status) {
        this.activeModal.close(status);
    }

}
