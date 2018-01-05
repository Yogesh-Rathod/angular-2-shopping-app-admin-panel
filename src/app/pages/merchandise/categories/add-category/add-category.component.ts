import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import './ckeditor.loader';
import 'ckeditor';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Location } from '@angular/common';

import { Config } from 'app/pages/app-config';
import { MerchandiseService } from 'app/services';
import { CategoryDeletePopupComponent } from '../delete-popup/delete-popup.component';

@Component({
    selector: 'app-add-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

    public config = {
        uiColor: '#F0F3F4',
        height: '200'
    };
    addCategoryForm: FormGroup;
    showLoader = false;
    deleteLoader = false;
    categoriesMaxLevel = Config.categoriesMaxLevel;
    categories: any;
    categoryId: any;
    categoryInfo: any;
    categoriesDropdownSettings = {
        singleSelection: true,
        text: "Select Parent Category",
        enableSearchFilter: true,
        classes: 'col-9 no_padding'
    };
    type = ['Merchandise', 'Gift Card'];
    level = ['Category', 'Sub Category', 'Sub Sub Category'];

    constructor(
        private location: Location,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private merchandiseService: MerchandiseService,
        private toastr: ToastsManager,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.params.subscribe(params =>
            this.categoryId = params['categoryId']
        )
    }

    ngOnInit() {
        this.createForm();
        this.getAllCategories();
        if (this.categoryId) {
            this.getCategoryInfoForEdit();
        }
    }

    getAllCategories() {
        this.showLoader = true;
        this.merchandiseService.getCategories().
            then((categories) => {
                this.categories = categories.Data;
                this.categories = this.categories.map((category) => {
                    category.itemName = category.Name;
                    category.id = category.Id;
                    return category;
                })
                this.showLoader = false;
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    createForm() {
        this.addCategoryForm = this.fb.group({
            'Id': [''],
            'Name': ['', Validators.compose([Validators.required,
            Validators.minLength(1), Validators.maxLength(100)])],
            'Description': ['', Validators.compose([Validators.required,
            Validators.minLength(1), Validators.maxLength(1000)])],
            'ParentCategoryId': [''],
            'DisplayOrder': ['', Validators.compose([Validators.required])],
            'IsActive': ['TRUE']
        });
    }

    addCategory(addCategoryFormValues) {
        console.log("addCategoryFormValues ", addCategoryFormValues);
        this.showLoader = true;
        addCategoryFormValues.Status = addCategoryFormValues.IsActive;
        if (addCategoryFormValues.Id) {
            this.merchandiseService.addCategory(addCategoryFormValues).
                then((response) => {
                    console.log("response ", response);
                    if (response.Code === 200) {
                        this.toastr.success('Category sent for approval process.', 'Sucess!');
                        this.location.back();
                        this.showLoader = false;
                    } else if (response.Code === 500) {
                        this.toastr.error('Category could not update.', 'Error!');
                        this.showLoader = false;
                    }
                }).catch((error) => {
                    console.log("error ", error);
                });
        } else {
            delete addCategoryFormValues.Id;
            this.merchandiseService.addCategory(addCategoryFormValues).
                then((response) => {
                    console.log("response ", response);
                    if (response.Code === 200) {
                        this.toastr.success('Category sent for approval process.', 'Sucess!');
                        this.location.back();
                        this.showLoader = false;
                    } else if (response.Code === 500) {
                        this.toastr.error('Category could not add.', 'Error!');
                        this.showLoader = false;
                    }
                }).catch((error) => {
                    console.log("error ", error);
                });
        }
    }

    imageUpload(event) {
        const uploadedImage = event.target.files[0] ? event.target.files[0].name : '';
        this.addCategoryForm.controls['picture'].setValue(uploadedImage);
    }

    getCategoryInfoForEdit() {
        if (this.categoryId) {
            console.log("this.categories ", this.categories);
            this.addCategoryForm.controls['Id'].setValue(this.categoryId);
        }
    }

    resetForm() {
        this.createForm();
    }

}
