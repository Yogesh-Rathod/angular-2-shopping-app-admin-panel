import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { OrdersService } from 'app/services';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

    orderId: any;
    orderInfo: any;
    orders: any;
    deleteLoader = false;
    bigLoader = false;

    constructor(
        private _location: Location,
        public toastr: ToastsManager,
        private ordersService: OrdersService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.params.subscribe(params =>
            this.orderId = params['orderId']
        )
        if (this.orderId) {
            this.getOrderDetails();
        }
    }

    ngOnInit() {

    }

    getOrderDetails() {
        if (this.orderId) {
            this.ordersService.getOrdersByPONumber(this.orderId, null).
                then((order) => {
                    this.orderInfo = order.Data;
                }).catch((error) => {
                    console.log("getOrderDetails error ", error);
                    if (error) {
                        this.toastr.error('Something went wrong.', 'Error!');
                        this.goBack();
                    }
                })
        }
    }

    goBack() {
        this._location.back();
    }

}
