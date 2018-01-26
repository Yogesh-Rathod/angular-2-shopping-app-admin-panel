import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
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
    orderCancelled = false;
    cancelForm: FormGroup;
    rtoForm: FormGroup;
    cancelLoader = false;
    showCancelForm = false;
    showRTOForm = false;
    hideCancelButton = false;
    hideRTOButton = false;
    cancelError = false;
    markRTOError = false;
    rtoErrorMessage: any;

    constructor(
        private _location: Location,
        public toastr: ToastsManager,
        private ordersService: OrdersService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.route.params.subscribe(params =>
            this.orderId = params['orderId']
        )
    }

    ngOnInit() {
        if (this.orderId) {
            this.getOrderDetails();
        }
    }

    createForm() {
        // if (this.orderInfo) {
            this.cancelForm = this.fb.group({
            'PurchaseOrderNumber': [this.orderInfo.PurchaseOrderNumber],
            'Reason': ['', Validators.required],
            'Comments': ['']
        });
        this.rtoForm = this.fb.group({
            'PurchaseOrderNumber': [this.orderInfo.PurchaseOrderNumber],
            'Reason': ['', Validators.required]
        });
        // }

    }

    cancelOrderButton() {
        this.showCancelForm = true;
        this.hideCancelButton = true;
    }

    markRTOButton() {
        this.showRTOForm = true;
        this.hideRTOButton = true;
    }

    cancelOrder(cancelForm) {
        this.cancelLoader = true;
        let ordersToCancel = [];
        ordersToCancel.push(cancelForm);
        this.ordersService.cancelOrder(ordersToCancel).
            then((success) => {
                if (success.Code === 200) {
                    this.orderCancelled = true;
                    this.showCancelForm = false;
                    this.cancelError = false;
                } else {
                    this.cancelError = true;
                }
                this.cancelLoader = false;
            });
    }

    markRTO(rtoForm) {
        this.cancelLoader = true;
        console.log("rtoForm ", rtoForm);
        let ordersToRTO = [];
        ordersToRTO.push(rtoForm);
        rtoForm.PurchaseOrderNumber = 'LVB-TL-8-10000088';
        console.log("rtoForm ", rtoForm);
        this.ordersService.markOrderRTO(ordersToRTO).
            then((success) => {
                if (success.Code === 200 && success.Data[0].Status !== 'Failed') {
                    this.showRTOForm = false;
                    this.markRTOError = false;
                    this.toastr.success('Successfully marked RTO.', 'Success');
                    this.getOrderDetails();
                } else {
                    this.rtoErrorMessage = success.Data[0].Reason;
                    this.markRTOError = true;
                }
                this.cancelLoader = false;
            });
    }

    getOrderDetails() {
        this.bigLoader = true;
        if (this.orderId) {
            this.ordersService.getOrdersByPONumber(this.orderId, null).
                then((order) => {
                    console.log("orders ", order.Data);
                    this.orderInfo = order.Data;
                    if (order.Data.Status) {
                        if (order.Data.Status.match(/cancel/i)) {
                            this.hideCancelButton = true;
                        }
                        if (!order.Data.Status.match(/dispatch/i) || order.Data.Status.match(/rto/i)) {
                            this.hideRTOButton = true;
                        }
                    }
                    this.bigLoader = false;
                    this.createForm();
                }).catch((error) => {
                    console.log("error ", error);
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
