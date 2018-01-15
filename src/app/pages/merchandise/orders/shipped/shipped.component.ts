import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';

import { ProductsService, OrdersService, JsonToExcelService } from 'app/services';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerOrdersAdminBulkUploadComponent } from '../bulk-upload/bulk-upload.component';

@Component({
    selector: 'app-shipped',
    templateUrl: './shipped.component.html',
    styleUrls: ['./shipped.component.scss']
})
export class ShippedComponent implements OnInit {
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
            return item.Status === 'DISPATCHED'
        })
    }

    ngOnChanges(changes) {
        this.getAllOrders();
    }

    importOrders() {
        const activeModal = this.modalService.open(SellerOrdersAdminBulkUploadComponent, { size: 'sm' });
        activeModal.componentInstance.fileUrl = 'DispatchedToDelivered.xlsx';
        activeModal.componentInstance.request = 'shipped';
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
