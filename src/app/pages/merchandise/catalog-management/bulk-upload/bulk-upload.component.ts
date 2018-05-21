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
    excelTemplate: any;

    constructor(
        private catalogManagementService: CatalogManagementService,
        private toastr: ToastsManager,
        private productsService: ProductsService,
        private activeModal: NgbActiveModal,
        private xlsxToJsonService: XlsxToJsonService,
        private jsonToExcelService: JsonToExcelService
    ) {}

    ngOnInit() {
        if (this.isApproval) {
            this.excelTemplate = 'CatalogProductMappingApprove.xlsx';
        } else {
            this.excelTemplate = 'CatalogProductUpload.xlsx';
        }
    }

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
                    let productsToMap = {
                        CatalogId: this.catalogId,
                        Products: this.productsInfo
                    };
                    this.catalogManagementService
                        .mapProductToCatalog(productsToMap)
                        .then(success => {
                            if (success.Success) {
                                this.toastr.success(
                                    'Product sucessfully sent for approval!',
                                    'Success!'
                                );
                                this.closeModal(true);
                            } else {
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
                                'Oops! Could not add products.',
                                'Error!'
                            );
                        });
                    break;

                case 'approve':
                    var approveObj = {
                        CatalogId: this.catalogId,
                        Products: this.productsInfo
                    };
                    this.catalogManagementService
                        .approveProductPostCatalog(approveObj)
                        .then(res => {
                            if (res.Success) {
                                this.toastr.success(
                                    'Products approved successfully.',
                                    'Sucess!'
                                );
                                this.closeModal(true);
                                this.showLoader = false;
                            } else {
                                this.showLoader = false;
                                this.toastr.error(
                                    'Could not approve products.',
                                    'Error!'
                                );
                            }
                        });
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
