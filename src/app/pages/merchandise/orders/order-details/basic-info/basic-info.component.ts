import { Component, OnInit, Input } from '@angular/core';
declare let $: any;
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OrdersService } from 'app/services';

@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {

    @Input() orderInfo: any;
    orderCancelled = false;
    cancelForm: FormGroup;
    cancelLoader = false;
    showCancelForm = false;
    hideCancelButton = false;

    constructor(
        private ordersService: OrdersService,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.createForm();
    }

    createForm() {
        this.cancelForm = this.fb.group({
            'PurchaseOrderNumber': [this.orderInfo.PurchaseOrderNumber],
            'Reason': [''],
            'Comments': ['']
        });
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
                }
                this.cancelLoader = false;
            });
    }

}
