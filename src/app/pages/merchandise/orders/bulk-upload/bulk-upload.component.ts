import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { OrdersService, XlsxToJsonService, JsonToExcelService } from 'app/services';

@Component({
    selector: 'app-bulk-upload',
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.scss']
})
export class SellerOrdersAdminBulkUploadComponent implements OnInit {

    submitDisabled = true;
    blankFileError = false;
    showUploadError = false;
    showLoader = false;
    fileUrl: string;
    result: any;
    ordersInfo: any;
    request: any;
    errorData: any;

    constructor(
        private jsonToExcelService: JsonToExcelService,
        private xlsxToJsonService: XlsxToJsonService,
        private ordersService: OrdersService,
        private toastr: ToastsManager,
        private activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
    }

    handleFile(event) {
        // this.validationError = null;
        this.blankFileError = false;
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
                        this.ordersInfo = this.result;
                        this.showLoader = false;
                        this.submitDisabled = false;
                    } else {
                        this.blankFileError = true;
                        this.showLoader = false;
                    }
                }
            });
        } else {
            this.ordersInfo = [];
            this.submitDisabled = true;
        }
    }

    uploadFile(event) {
        event.preventDefault();
        this.showLoader = true;
        if (this.ordersInfo && this.ordersInfo.length > 0) {
            switch (this.request) {
                case "fresh":
                    this.ordersService.sendToProcessed(this.ordersInfo).
                        then((success) => {
                            console.log("success ", success);
                            if (success.Data.length === 0) {
                                this.toastr.success('Sucessfully Done', 'Success!');
                                this.showLoader = false;
                                this.errorData = success.Data;
                                this.closeModal(true);
                            } else if (success.Data.length > 0) {
                                this.showLoader = false;
                                this.errorData = success.Data;
                                this.toastr.error('Oops! Could not process request.', 'Error!');
                            }
                        }).catch((error) => {
                            console.log("error ", error);
                            this.toastr.error('Oops! Could not process request.', 'Error!');
                            this.showLoader = false;
                        });
                    break;

                case "processed":
                    this.ordersService.sendToDispatched(this.ordersInfo).
                        then((success) => {
                            console.log("success ", success);
                            if (success.Data.length === 0) {
                                this.toastr.success('Sucessfully Done', 'Success!');
                                this.showLoader = false;
                                this.errorData = success.Data;
                                this.closeModal(true);
                            } else if (success.Data.length > 0) {
                                this.showLoader = false;
                                this.errorData = success.Data;
                                this.toastr.error('Oops! Could not process request.', 'Error!');
                            }
                        }).catch((error) => {
                            console.log("error ", error);
                            this.toastr.error('Oops! Could not process request.', 'Error!');
                            this.showLoader = false;
                        });
                    break;

                case "shipped":
                    this.ordersService.sendToDelivered(this.ordersInfo).
                        then((success) => {
                            console.log("success ", success);
                            if (success.Data.length === 0) {
                                this.toastr.success('Sucessfully Done', 'Success!');
                                this.showLoader = false;
                                this.errorData = success.Data;
                                this.closeModal(true);
                            } else if (success.Data.length > 0) {
                                this.showLoader = false;
                                this.errorData = success.Data;
                                this.toastr.error('Oops! Could not process request.', 'Error!');
                            }
                        }).catch((error) => {
                            console.log("error ", error);
                            this.toastr.error('Oops! Could not process request.', 'Error!');
                            this.showLoader = false;
                        });
                    break;

                case "cancel":
                console.log("this.ordersInfo ", this.ordersInfo);
                    this.ordersService.cancelOrder(this.ordersInfo).
                        then((success) => {
                            console.log("success ", success);
                            if (success.Data.length === 0) {
                                this.toastr.success('Sucessfully Done', 'Success!');
                                this.showLoader = false;
                                this.errorData = success.Data;
                                this.closeModal(true);
                            } else if (success.Data.length > 0) {
                                this.showLoader = false;
                                this.errorData = success.Data;
                                this.toastr.error('Oops! Could not process request.', 'Error!');
                            }
                        }).catch((error) => {
                            console.log("error ", error);
                            this.toastr.error('Oops! Could not process request.', 'Error!');
                            this.showLoader = false;
                        });
                    break;
                default:
                    // code...
                    break;
            }

        }
    }

    downloadFile() {
        this.jsonToExcelService.exportAsExcelFile(this.errorData, this.request + '_products');
        this.closeModal(true);
    }

    closeModal(status) {
        this.activeModal.close(status);
    }

}
