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

@Component({
    selector: 'app-delivered',
    templateUrl: './delivered.component.html',
    styleUrls: ['./delivered.component.scss']
})
export class DeliveredComponent implements OnInit {
    @Input() orders;
    @Input() hasFilters;
    @Output() onStatusChange = new EventEmitter<any>();

    constructor(
        private jsonToExcelService: JsonToExcelService,
        private productsService: ProductsService,
        private ordersService: OrdersService
    ) {}

    ngOnInit() {
        this.getAllOrders();
        if (!this.hasFilters) {
            this.getDeliveredOrders();
        }
    }

    getDeliveredOrders() {
        this.ordersService
            .getOrdersByPONumber(null, 'e.status=DELIVERED')
            .then(orders => {
                if (orders.Data) {
                    this.orders = orders.Data.PurchaseOrder;
                }
            })
            .catch(error => {});
    }

    ngOnChanges(changes) {
        this.getAllOrders();
        if (!this.hasFilters) {
            this.getDeliveredOrders();
        }
    }

    getAllOrders() {
        this.orders = this.orders.filter(item => {
            return item.Status === 'DELIVERED';
        });
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
