import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {
    ProductsService,
    XlsxToJsonService,
    JsonToExcelService,
    CatalogManagementService
} from 'app/services';

@Component({
    selector: 'app-bulk-upload',
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.scss']
})
export class CatalogBulkUploadComponent implements OnInit {
    downloadIssue = [];
    submitDisabled = true;
    showUploadError = false;
    showLoader = false;
    productsInfo: any;
    result: any;
    blankFileError = false;
    catalogId: String;
    isApproval: any;

    constructor(
        private catalogManagementService: CatalogManagementService,
        private toastr: ToastsManager,
        private productsService: ProductsService,
        private activeModal: NgbActiveModal,
        private xlsxToJsonService: XlsxToJsonService,
        private jsonToExcelService: JsonToExcelService
    ) {}

    ngOnInit() {}

    handleFile(event) {
        this.blankFileError = false;
        let file = event.target.files[0];
        if (file) {
            this.showLoader = true;
            let objectkey = '';
            this.xlsxToJsonService
                .processFileToJson({}, file)
                .subscribe(data => {
                    if (data['sheets']) {
                        const sheetKey = Object.keys(data['sheets']);
                        this.result = data['sheets'][sheetKey[0]];
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

    download() {
        this.jsonToExcelService.exportAsExcelFile(
            this.downloadIssue,
            'products'
        );
    }

    sendApproval(action) {
        this.showLoader = true;
        if (this.productsInfo && this.productsInfo.length > 0) {
            switch (action) {
                case 'sendApproval':
                    this.catalogManagementService
                        .mapProductToCatalog('', this.productsInfo)
                        .then(success => {
                            if (
                                success.Code === 200 &&
                                success.Data &&
                                success.Data.length === 0
                            ) {
                                this.toastr.success(
                                    'Product sucessfully sent for approval!',
                                    'Success!'
                                );
                                this.showLoader = false;
                                this.closeModal(true);
                            } else if (success.Data) {
                                this.downloadIssue = success.Data;
                                this.toastr.error(
                                    'Oops! Could not upload all products.',
                                    'Error!'
                                );
                            } else if (success.Code === 500) {
                                this.toastr.error(
                                    'Oops! Could not send products for approval.',
                                    'Error!'
                                );
                            }
                            this.showLoader = false;
                        })
                        .catch(error => {
                            this.showLoader = false;
                            this.toastr.error(
                                'Oops! Could not upload products.',
                                'Error!'
                            );
                        });
                    break;

                case 'approve':
                    break;
                case 'reject':
                    break;
                default:
                    break;
            }
        }
    }

    closeModal(status) {
        this.activeModal.close(status);
    }
}
