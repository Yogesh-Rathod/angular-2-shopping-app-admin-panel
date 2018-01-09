import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

    addCategoryForm: FormGroup;
    showLoader = false;
    BigLoader = false;
    categories: any;
    addNewCategoryFields = false;
    categoryId: any;
    categoryInfo: any;
    level1Categories: any;
    level2Categories: any;
    level3Categories: any;
    type = ['Merchandise', 'Gift Card'];

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
        this.BigLoader = true;
        this.merchandiseService.getCategories().
            then((categories) => {
                this.categories = categories.Data;
                this.BigLoader = false;
                this.getLevel1Categories(1);
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    getLevel1Categories(level) {
        this.merchandiseService.getCategoriesByLevel(level).
            then((categories) => {
                console.log("getCategoriesByLevel categories ", categories);
                this.level1Categories = categories.Data;
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    createForm() {
        this.addCategoryForm = this.fb.group({
            'Id': [''],
            'type': ['', Validators.compose([Validators.required])],
            'category': [''],
            'sub-category': [''],
            'sub-sub-category': ['new'],
            'Name': ['', Validators.compose([Validators.required,
            Validators.minLength(1), Validators.maxLength(100)])],
            // 'Description': ['', Validators.compose([
            // Validators.minLength(1), Validators.maxLength(1000)])],
            'ParentCategoryId': [[]],
            'DisplayOrder': ['', Validators.compose([Validators.required])],
            'IsActive': ['TRUE']
        });
    }

    addCategory(addCategoryFormValues) {
        this.showLoader = true;
        if (typeof addCategoryFormValues.Name !== 'string') {
            addCategoryFormValues.Name = addCategoryFormValues.Name.Name;
        }
        if (addCategoryFormValues.Id) {
            console.log("addCategoryFormValues ", addCategoryFormValues);
            // this.merchandiseService.addCategory(addCategoryFormValues).
            //     then((response) => {
            //         console.log("response ", response);
            //         if (response.Code === 200) {
            //             this.toastr.success('Updated Category sent for approval process.', 'Sucess!');
            //             this.location.back();
            //             this.showLoader = false;
            //         } else if (response.Code === 500) {
            //             this.toastr.error('Category could not update.', 'Error!');
            //             this.showLoader = false;
            //         }
            //     }).catch((error) => {
            //         console.log("error ", error);
            //     });
        } else {
            delete addCategoryFormValues.Id;
            console.log("addCategoryFormValues ", addCategoryFormValues);
            // this.merchandiseService.addCategory(addCategoryFormValues).
            //     then((response) => {
            //         console.log("response ", response);
            //         if (response.Code === 200) {
            //             this.toastr.success('Category sent for approval process.', 'Sucess!');
            //             this.location.back();
            //             this.showLoader = false;
            //         } else if (response.Code === 500) {
            //             this.toastr.error('Category could not add.', 'Error!');
            //             this.showLoader = false;
            //         }
            //     }).catch((error) => {
            //         console.log("error ", error);
            //     });
        }
    }

    imageUpload(event) {
        const uploadedImage = event.target.files[0] ? event.target.files[0].name : '';
        this.addCategoryForm.controls['picture'].setValue(uploadedImage);
    }

    addNewCategorySelected(selectItem) {
        if (this.addCategoryForm.controls[selectItem].value === 'new') {
            this.addNewCategoryFields = true;
        } else {
            this.addNewCategoryFields = false;
        }

        if (selectItem === 'sub-category') {
            this.addNewCategoryFields = true;
        }
    }

    level1Change() {
        const selectedCategory = this.addCategoryForm.controls['category'].value;
        if (selectedCategory === 'new') {
            console.log("selectedCategory ", selectedCategory);
            this.addNewCategoryFields = true;
        } else {
            this.addNewCategoryFields = false;
            this.merchandiseService.getCategoriesByLevel(3).
                then((categories) => {
                    this.level2Categories = categories.Data;
                    // this.level2Categories = this.level2Categories.filter((category) => {
                    //     if (selectedCategory == category.ParentCategoryId) {
                    //         return category;
                    //     }
                    // });
                }).catch((error) => {
                    console.log("error ", error);
                });
        }
    }

    getCategoryInfoForEdit() {
        this.BigLoader = true;
        if (this.categoryId) {
            this.merchandiseService.getCategories(this.categoryId).
                then((categoryInfo) => {
                    this.categoryInfo = categoryInfo.Data;
                    console.log("categoryInfo ", this.categoryInfo);
                    this.addCategoryForm.controls['Id'].setValue(this.categoryInfo.ApprovalCategoryId);
                    this.addCategoryForm.controls['Name'].setValue(this.categoryInfo.Name);
                    // this.addCategoryForm.controls['Description'].setValue(this.categoryInfo.Description);
                    this.addCategoryForm.controls['DisplayOrder'].setValue(this.categoryInfo.DisplayOrder);
                    this.addCategoryForm.controls['IsActive'].setValue(this.categoryInfo.IsActive);
                    this.addCategoryForm.controls['ParentCategoryId'].setValue(this.categoryInfo.ParentCategoryId);
                    this.BigLoader = false;
                }).catch((error) => {
                    console.log("error ", error);
                });
        }
    }

    resetForm() {
        this.createForm();
    }

}
