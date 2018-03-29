import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProductsService, OrdersService, JsonToExcelService, VendorsService } from 'app/services';
import * as _ from 'lodash';
import { SellerOrderStatusUpdateComponent } from '../status-update/status-update.component';

@Component({
    selector: 'app-rto',
    templateUrl: './rto.component.html',
    styleUrls: ['./rto.component.scss']
})
export class RtoComponent implements OnInit {
    @Input() orders;
    @Output() onStatusChange = new EventEmitter<any>();

    constructor(
        private modalService: NgbModal,
        private jsonToExcelService: JsonToExcelService,
        private ordersService: OrdersService
    ) { }

    ngOnInit() {
        this.getAllOrders();
    }

    getAllOrders() {
        this.orders = this.orders.filter(item => {
            if (item.Status.match(/rto/i)) {
                return item;
            }
        })
    }

    ngOnChanges(changes) {
        this.getAllOrders();
    }

    updateStatus(item) {
        const activeModal = this.modalService.open(SellerOrderStatusUpdateComponent, { size: 'sm' });
        if (item.Status.match(/processed/i)) {
            activeModal.componentInstance.request = 'processed';
        } else if (item.Status.match(/fresh/i)) {
            activeModal.componentInstance.request = 'fresh';
        } else if (item.Status.match(/dispatch/i)) {
            activeModal.componentInstance.request = 'dispatched';
        }
        activeModal.componentInstance.PurchaseOrderNumber = item.PurchaseOrderNumber;
        activeModal.result.then(status => {
            if (status) {
                this.onStatusChange.emit(true);
                this.getAllOrders();
            }
        }).catch(status => { })
    }

    exportProducts() {
        _.forEach(this.orders, (item) => {
            delete item.CancellationReason; delete item.isChecked;
        });
        this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
    }

}
