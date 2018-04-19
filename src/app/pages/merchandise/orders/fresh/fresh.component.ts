import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';

import { ProductsService, OrdersService, JsonToExcelService } from 'app/services';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerOrdersAdminBulkUploadComponent } from '../bulk-upload/bulk-upload.component';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    selector: 'app-fresh',
    templateUrl: './fresh.component.html',
    styleUrls: ['./fresh.component.scss']
})
export class FreshComponent implements OnInit {
    @Input() orders;
    @Output() onStatusChange = new EventEmitter<any>();

    selectAllCheckbox = false;
    showSelectedAction = false;
    showLoader = false;

    constructor(
        private modalService: NgbModal,
        private toastr: ToastsManager,
        private jsonToExcelService: JsonToExcelService,
        private productsService: ProductsService,
        private ordersService: OrdersService
    ) { }

    ngOnInit() {
        this.getAllOrders();
    }

    ngOnChanges(changes) {
        this.getAllOrders();
    }

    getAllOrders() {
        this.orders = this.orders.filter(item => {
            return item.Status === 'FRESH'
        })
    }

    selectAll(e) {
        if (e.target.checked) {
            this.selectAllCheckbox = true;
            _.forEach(this.orders, (item) => {
                item.isChecked = true;
            });
            this.showSelectedAction = true;
        } else {
            // this.noActionSelected = false;
            this.selectAllCheckbox = false;
            _.forEach(this.orders, (item) => {
                item.isChecked = false;
            });
            this.showSelectedAction = false;
        }
    }

    checkBoxSelected(e, item) {
        this.selectAllCheckbox = false;
        if (e.target.checked) {
            item.isChecked = true;
        } else {
            // this.noActionSelected = false;
            item.isChecked = false;
        }

        let isCheckedArray = [];

        _.forEach(this.orders, (item) => {
            if (item.isChecked) {
                this.showSelectedAction = true;
                isCheckedArray.push(item);
            }
        });

        if (isCheckedArray.length === 0) {
            this.showSelectedAction = false;
        }

    }

    updateToProcessed() {
        this.showLoader = true;
        let productsToApprove = [];
        if (this.selectAllCheckbox) {
            _.forEach(this.orders, (item) => {
                productsToApprove.push({
                    PurchaseOrderNumber: item.PurchaseOrderNumber
                });
                item.isChecked = false;
            });
        } else {
            _.forEach(this.orders, (item) => {
                if (item.isChecked) {
                    productsToApprove.push({
                        PurchaseOrderNumber: item.PurchaseOrderNumber
                    });
                    item.isChecked = false;
                }
            });
        }
        this.ordersService.sendToProcessed(productsToApprove).
            then((success) => {
                if (success.Code === 200) {
                    this.getAllOrders();
                    this.showLoader = false;
                    this.onStatusChange.emit(true);
                }
                if (success.Data.length === 0) {
                    this.showLoader = false;
                    this.onStatusChange.emit(true);
                    this.toastr.success('Status changed successfully.', 'Success');
                }
            }).catch((error) => {
                this.showLoader = false;
                this.toastr.error('Oops! Could not change status.', 'Error!');
            });
        this.selectAllCheckbox = false;
        this.showSelectedAction = false;
    }

    importOrders() {
        const activeModal = this.modalService.open(SellerOrdersAdminBulkUploadComponent, { size: 'sm' });
        activeModal.componentInstance.fileUrl = 'freshToProcessed.xlsx';
        activeModal.componentInstance.request = 'fresh';
        activeModal.result.then(status => {
            if (status) {
                this.onStatusChange.emit(true);
                this.getAllOrders();
            }
        }).catch(status => { })
    }

    exportProducts() {
        let isCheckedArray = [];

        _.forEach(this.orders, (item) => {
            if (item.isChecked) {
                isCheckedArray.push(item);
            }
        });
        if (isCheckedArray.length === 0 ) {
            this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
        } else {
            this.jsonToExcelService.exportAsExcelFile(isCheckedArray, 'orders');
        }
    }

    downloadPDF(purchaseordernumber) {
        let productsToDownload = [];
        if (purchaseordernumber) {
            productsToDownload.push(purchaseordernumber);
            let resquestBody = {
                Ids: productsToDownload
            };
            console.log("resquestBody ", resquestBody);
            this.ordersService.downloadPOPdf(resquestBody).
                then((success) => {
                    console.log("success ", success);
                }).catch((error) => {
                    console.log("error ", error);
                });
        } else {
            if (this.selectAllCheckbox) {
                _.forEach(this.orders, (item) => {
                    productsToDownload.push(item.PurchaseOrderNumber);
                    item.isChecked = false;
                });
            } else {
                _.forEach(this.orders, (item) => {
                    if (item.isChecked) {
                        productsToDownload.push(item.PurchaseOrderNumber);
                        item.isChecked = false;
                    }
                });
            }
            let resquestBody = {
                Ids: productsToDownload
            };
            console.log("resquestBody ", resquestBody);
            this.ordersService.downloadPOPdf(resquestBody).
                then((success) => {
                    console.log("success ", success);
                }).catch((error) => {
                    console.log("error ", error);
                });
            this.selectAllCheckbox = false;
            this.showSelectedAction = false;
        }
    }

}
