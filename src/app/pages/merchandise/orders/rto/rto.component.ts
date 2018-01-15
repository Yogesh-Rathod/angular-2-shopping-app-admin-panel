import { Component, OnInit } from '@angular/core';
import { ProductsService, OrdersService, JsonToExcelService, VendorsService } from 'app/services';

@Component({
    selector: 'app-rto',
    templateUrl: './rto.component.html',
    styleUrls: ['./rto.component.scss']
})
export class RtoComponent implements OnInit {

    orders: any;

    constructor(
        private ordersService: OrdersService
    ) { }

    ngOnInit() {
        this.getAllOrders();
    }

    getAllOrders() {
        // this.bigLoader = true;
        this.ordersService.getOrdersByPONumber().
            then((orders) => {
                this.orders = orders.Data.PurchaseOrder;
                console.log("orders ", orders);
                // this.bigLoader = false;
            }).catch((error) => {
                console.log("error ", error);
            })
        // this.orders = this.ordersService.getOrders();
    }

}
