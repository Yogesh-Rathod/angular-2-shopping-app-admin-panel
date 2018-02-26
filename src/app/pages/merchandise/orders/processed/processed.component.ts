import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';

import { ProductsService, OrdersService, JsonToExcelService } from 'app/services';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerOrdersAdminBulkUploadComponent } from '../bulk-upload/bulk-upload.component';
import { StatusUpdateComponent } from '../status-update/status-update.component';

@Component({
    selector: 'app-processed',
    templateUrl: './processed.component.html',
    styleUrls: ['./processed.component.scss']
})
export class ProcessedComponent implements OnInit {
    @Input() orders;
    @Output() onStatusChange = new EventEmitter<any>();
    showSelectedAction = false;

    constructor(
        private modalService: NgbModal,
        private jsonToExcelService: JsonToExcelService,
        private productsService: ProductsService,
        private ordersService: OrdersService
    ) { }

    ngOnInit() {
        this.getAllOrders();
    }

    getAllOrders() {
        this.orders = this.orders.filter(item => {
            return item.Status === 'PROCESSED'
        });
    }

    ngOnChanges(changes) {
        this.getAllOrders();
    }

    importOrders() {
        const activeModal = this.modalService.open(SellerOrdersAdminBulkUploadComponent, { size: 'sm' });
        activeModal.componentInstance.fileUrl = 'ProcessedToDispached.xlsx';
        activeModal.componentInstance.request = 'processed';
        activeModal.result.then(status => {
            if (status) {
                this.onStatusChange.emit(true);
                this.getAllOrders();
            }
        }).catch(status => { })
    }

    updateStatus(PurchaseOrderNumber) {
        const activeModal = this.modalService.open(StatusUpdateComponent, { size: 'sm' });
        activeModal.componentInstance.request = 'processed';
        activeModal.componentInstance.PurchaseOrderNumber = PurchaseOrderNumber;
        activeModal.result.then(status => {
            if (status) {
                this.onStatusChange.emit(true);
                this.getAllOrders();
            }
        }).catch(status => { })
    }

    exportProducts() {
        this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
    }

}
