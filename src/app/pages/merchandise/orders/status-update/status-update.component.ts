import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';

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
        private fb: FormBuilder,
        private activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.updateStatusForm = this.fb.group({
            'PurchaseOrderNumber': [this.PurchaseOrderNumber],
            'DispatchDate': ['', Validators.compose([Validators.required])],
            'TrackingNo': ['', Validators.compose([Validators.required])],
            'CourierName': ['', Validators.compose([Validators.required])],
        });
    }

    updateStatus(updateStatusForm) {
        console.log("updateStatusForm ", updateStatusForm);

    }

    closeModal(status) {
        this.activeModal.close(status);
    }

}
