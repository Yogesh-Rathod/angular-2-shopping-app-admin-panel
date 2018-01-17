import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';

import { ProductsService, OrdersService, JsonToExcelService } from 'app/services';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

    exportProducts() {
        this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
    }

}
