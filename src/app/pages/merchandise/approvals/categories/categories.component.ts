import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { MerchandiseService } from 'app/services';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

    unApprovedCategories: any[];
    approvalForm: FormGroup;

    constructor(
        public toastr: ToastsManager,
        private fb: FormBuilder,
        private merchandiseService: MerchandiseService
    ) { }

    ngOnInit() {
        this.getUnApprovedCategories();
        this.createForm();
    }

    createForm() {
        this.approvalForm = this.fb.group({
            'Id': [''],
            'Reason': [''],
            'IsApproved': ['TRUE']
        });
    }

    getUnApprovedCategories() {
        // this.showLoader = true;
        this.merchandiseService.getUnApprovedCategories().
            then((categories) => {
                console.log("this.unApprovedCategories ", categories);
                this.unApprovedCategories = categories.Data;
                // this.showLoader = false;
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    approveCategory(approvalForm, category) {
        approvalForm.Id = category.Id;
        category.approvalLoader = true;
        this.merchandiseService.approveCategory(approvalForm).
            then((response) => {
                console.log("response ", response);
                if (response.Code === 200) {
                    this.toastr.success('Category approved successfully.', 'Sucess!');
                    category.approvalLoader = false;
                    this.createForm();
                    this.getUnApprovedCategories();
                } else if (response.Code === 500) {
                    this.toastr.error('Could not approve category.', 'Error!');
                    category.approvalLoader = false;
                }
            }).catch((error) => {
                console.log("error ", error);
            });
    }

}
