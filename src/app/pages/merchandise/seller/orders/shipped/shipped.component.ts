import {
    Component,
    OnInit,
    Output,
    Input,
    EventEmitter,
    OnChanges
} from '@angular/core';

import {
    ProductsService,
    OrdersService,
    JsonToExcelService
} from 'app/services';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerOrdersBulkUploadComponent } from '../bulk-upload/bulk-upload.component';
import { SellerOrderStatusUpdateComponent } from '../status-update/status-update.component';

@Component({
    selector: 'app-shipped',
    templateUrl: './shipped.component.html',
    styleUrls: ['./shipped.component.scss']
})
export class ShippedComponent implements OnInit {
    @Input() orders;
    @Input() hasFilters;
    @Output() onStatusChange = new EventEmitter<any>();
    showSelectedAction = false;

    constructor(
        private modalService: NgbModal,
        private jsonToExcelService: JsonToExcelService,
        private productsService: ProductsService,
        private ordersService: OrdersService
    ) {}

    ngOnInit() {
        this.getAllOrders();
        if (!this.hasFilters) {
            this.getShippedOrders();
        }
    }

    getShippedOrders() {
        this.ordersService
            .getOrdersByPONumber(null, 'e.status=DISPATCHED')
            .then(orders => {
                if (orders.Data) {
                    this.orders = orders.Data.PurchaseOrder;
                }
            })
            .catch(error => {});
    }

    getAllOrders() {
        this.orders = this.orders.filter(item => {
            return item.Status === 'DISPATCHED';
        });
    }

    ngOnChanges(changes) {
        this.getAllOrders();
        if (!this.hasFilters) {
            this.getShippedOrders();
        }
    }

    updateStatus(PurchaseOrderNumber) {
        const activeModal = this.modalService.open(
            SellerOrderStatusUpdateComponent,
            { size: 'sm' }
        );
        activeModal.componentInstance.request = 'dispatched';
        activeModal.componentInstance.PurchaseOrderNumber = PurchaseOrderNumber;
        activeModal.result
            .then(status => {
                if (status) {
                    this.onStatusChange.emit(true);
                    this.getAllOrders();
                }
            })
            .catch(status => {});
    }

    importOrders() {
        const activeModal = this.modalService.open(
            SellerOrdersBulkUploadComponent,
            { size: 'sm' }
        );
        activeModal.componentInstance.fileUrl = 'DispatchedToDelivered.xlsx';
        activeModal.componentInstance.request = 'shipped';
        activeModal.result
            .then(status => {
                if (status) {
                    this.onStatusChange.emit(true);
                    this.getAllOrders();
                }
            })
            .catch(status => {});
    }

    exportProducts() {
        _.forEach(this.orders, item => {
            delete item.CancellationReason;
            delete item.RTOBy;
            delete item.RTODate;
            delete item.RTOComments;
            delete item.isChecked;
        });
        this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
    }

    downloadPDF() {
        let productsToDownload = [];
        _.forEach(this.orders, order => {
            productsToDownload.push(order.PurchaseOrderNumber);
        });
        let resquestBody = {
            Ids: productsToDownload
        };
        this.ordersService
            .downloadPOPdf(resquestBody)
            .then(success => {})
            .catch(error => {});
    }
}
