import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';

import { ProductsService, OrdersService, JsonToExcelService } from 'app/services';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerOrdersBulkUploadComponent } from '../bulk-upload/bulk-upload.component';

@Component({
  selector: 'app-cancellled',
  templateUrl: './cancellled.component.html',
  styleUrls: ['./cancellled.component.scss']
})
export class CancellledComponent implements OnInit {

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
            if (item.Status.match(/cancel/i)) {
                return item;
            }
        })
    }

    ngOnChanges(changes) {
        this.getAllOrders();
    }

    importOrders() {
        const activeModal = this.modalService.open(SellerOrdersBulkUploadComponent, { size: 'sm' });
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
