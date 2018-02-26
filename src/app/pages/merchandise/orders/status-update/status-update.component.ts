import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { OrdersService } from 'app/services';

@Component({
    selector: 'app-status-update',
    templateUrl: './status-update.component.html',
    styleUrls: ['./status-update.component.scss']
})
export class StatusUpdateComponent implements OnInit {

    request: any;
    PurchaseOrderNumber: any;
    updateStatusForm: FormGroup;
    myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        editableDateField: false,
        openSelectorOnInputClick: true
    };
    showLoader = false;

    constructor(
        private toastr: ToastsManager,
        private ordersService: OrdersService,
        private fb: FormBuilder,
        private activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.updateStatusForm = this.fb.group({
            'PurchaseOrderNumber': [this.PurchaseOrderNumber],
        });

        if (this.request === 'processed') {
            this.updateStatusForm.addControl('DispatchDate', new FormControl('', Validators.compose([Validators.required]) ) );
            this.updateStatusForm.addControl('TrackingNo', new FormControl('', Validators.compose([Validators.required]) ) );
            this.updateStatusForm.addControl('CourierName', new FormControl('', Validators.compose([Validators.required]) ) );
        } else if (this.request === 'dispatched') {
            this.updateStatusForm.addControl('DeliveryDate', new FormControl('', Validators.compose([Validators.required]) ) );
        }
    }

    updateStatus(updateStatusForm) {
        this.showLoader = true;
        const orderInfo = [];
        switch (this.request) {
            case "processed":
                updateStatusForm.DispatchDate = updateStatusForm.DispatchDate.formatted;
                orderInfo.push(updateStatusForm);
                this.ordersService.sendToDispatched(orderInfo).
                    then((success) => {
                        if (success.Data.length === 0) {
                            this.toastr.success('Status changed successfully.', 'Success!');
                            this.showLoader = false;
                            this.closeModal(true);
                        } else if (success.Data.length > 0) {
                            this.showLoader = false;
                            this.toastr.error('Oops! Could not change status.', 'Error!');
                        }
                    }).catch((error) => {
                        this.toastr.error('Oops! Could not change status.', 'Error!');
                        this.showLoader = false;
                    });
            break;
            case "dispatched":
                updateStatusForm.DeliveryDate = updateStatusForm.DeliveryDate.formatted;
                orderInfo.push(updateStatusForm);
                this.ordersService.sendToDelivered(orderInfo).
                    then((success) => {
                        if (success.Data.length === 0) {
                            this.toastr.success('Status changed successfully.', 'Success!');
                            this.showLoader = false;
                            this.closeModal(true);
                        } else if (success.Data.length > 0) {
                            this.showLoader = false;
                            this.toastr.error('Oops! Could not change status.', 'Error!');
                        }
                    }).catch((error) => {
                        this.toastr.error('Oops! Could not change status.', 'Error!');
                        this.showLoader = false;
                    });
                break;
        }

    }

    closeModal(status) {
        this.activeModal.close(status);
    }

}
