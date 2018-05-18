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
import { StatusUpdateComponent } from '../status-update/status-update.component';

@Component({
    selector: 'app-rto-orders',
    templateUrl: './rto-orders.component.html',
    styleUrls: ['./rto-orders.component.scss']
})
export class RtoOrdersComponent implements OnInit {
    @Input() orders;
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
    }

    getAllOrders() {
        this.orders = this.orders.filter(item => {
            if (item.Status.match(/rto/i)) {
                return item;
            }
        });
    }

    ngOnChanges(changes) {
        this.getAllOrders();
    }

    updateStatus(item) {
        const activeModal = this.modalService.open(StatusUpdateComponent, {
            size: 'sm'
        });
        if (item.Status.match(/processed/i)) {
            activeModal.componentInstance.request = 'processed';
        } else if (item.Status.match(/fresh/i)) {
            activeModal.componentInstance.request = 'fresh';
        } else if (item.Status.match(/dispatch/i)) {
            activeModal.componentInstance.request = 'dispatched';
        }
        activeModal.componentInstance.PurchaseOrderNumber =
            item.PurchaseOrderNumber;
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
