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

@Component({
    selector: 'app-cancellled',
    templateUrl: './cancellled.component.html',
    styleUrls: ['./cancellled.component.scss']
})
export class CancellledComponent implements OnInit {
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
            this.getCancelledOrders();
        }
    }

    getCancelledOrders() {
        this.ordersService
            .getOrdersByPONumber(null, 'e.status=Pending For Cancellation')
            .then(orders => {
                if (orders.Data) {
                    this.orders = orders.Data.PurchaseOrder;
                }
            })
            .catch(error => {});
    }

    getAllOrders() {
        this.orders = this.orders.filter(item => {
            if (item.Status.match(/cancel/i)) {
                return item;
            }
        });
    }

    ngOnChanges(changes) {
        this.getAllOrders();
        if (!this.hasFilters) {
            this.getCancelledOrders();
        }
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
