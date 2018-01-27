import { Component, OnInit, Input } from '@angular/core';
declare let $: any;
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OrdersService } from 'app/services';
import { ToastsManager } from 'ng2-toastr';

@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {

    @Input() orderInfo: any;
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
        public toastr: ToastsManager,
        private ordersService: OrdersService,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.createForm();
        if (this.orderInfo.Status.match(/cancel/i)) {
            this.hideCancelButton = true;
        }
        if (!this.orderInfo.Status.match(/deliver/i) || this.orderInfo.Status.match(/rto/i)) {
            this.hideRTOButton = true;
        }
    }

    createForm() {
        this.cancelForm = this.fb.group({
            'PurchaseOrderNumber': [this.orderInfo.PurchaseOrderNumber],
            'Reason': ['', Validators.required],
            'Comments': ['']
        });
        this.rtoForm = this.fb.group({
            'PurchaseOrderNumber': [this.orderInfo.PurchaseOrderNumber],
            'Reason': ['', Validators.required]
        });
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
                if (success.Code === 200 ) {
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
        this.ordersService.markOrderRTO(ordersToRTO).
            then((success) => {
                if (success.Code === 200) {
                    this.showRTOForm = false;
                    this.markRTOError = false;
                    this.toastr.success('Successfully marked RTO.', 'Success');
                } else {
                    this.rtoErrorMessage = success.Data[0].Reason;
                    this.markRTOError = true;
                }
                this.cancelLoader = false;
            });
    }

}
