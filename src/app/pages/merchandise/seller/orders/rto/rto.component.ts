import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { ProductsService, OrdersService, JsonToExcelService, VendorsService } from 'app/services';
import * as _ from 'lodash';

@Component({
    selector: 'app-rto',
    templateUrl: './rto.component.html',
    styleUrls: ['./rto.component.scss']
})
export class RtoComponent implements OnInit {
    @Input() orders;
    @Output() onStatusChange = new EventEmitter<any>();

    constructor(
        private jsonToExcelService: JsonToExcelService,
        private ordersService: OrdersService
    ) { }

    ngOnInit() {
        this.getAllOrders();
    }

    getAllOrders() {
        this.orders = this.orders.filter(item => {
            if (item.Status.indexOf('RTO') > -1) {
                return item;
            }
        })
    }

    exportProducts() {
        this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
    }

}
