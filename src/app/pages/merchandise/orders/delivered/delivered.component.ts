import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';

import { ProductsService, OrdersService, JsonToExcelService } from 'app/services';

@Component({
    selector: 'app-delivered',
    templateUrl: './delivered.component.html',
    styleUrls: ['./delivered.component.scss']
})
export class DeliveredComponent implements OnInit {
    @Input() orders;
    @Output() onStatusChange = new EventEmitter<any>();

    constructor(
        private jsonToExcelService: JsonToExcelService,
        private productsService: ProductsService,
        private ordersService: OrdersService
    ) { }

    ngOnInit() {
        this.getAllOrders();
    }

    ngOnChanges(changes) {
        this.getAllOrders();
    }

    getAllOrders() {
        this.orders = this.orders.filter(item => {
            return item.Status === 'DELIVERED'
        })
    }

    exportProducts() {
        this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
    }

}
