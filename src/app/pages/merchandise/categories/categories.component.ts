import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as CryptoJS from "crypto-js";
import * as utf8 from 'utf8';

import * as _ from 'lodash';
declare let $: any;

import { MerchandiseService } from 'app/services';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { CategoryDeletePopupComponent } from './delete-popup/delete-popup.component';

@Component({
    selector: 'app-categories',
    templateUrl: 'categories.component.html',
    styleUrls: ['categories.component.scss']
})
export class CategoriesComponent implements OnInit {

    categories: any;
    categoriesFiltered: any;
    unApprovedCategories: any;
    showLoader = true;
    deleteLoader: Number;
    approvalForm: FormGroup;

    constructor(
        private modalService: NgbModal,
        public toastr: ToastsManager,
        private fb: FormBuilder,
        private merchandiseService: MerchandiseService) {
    }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.getAllCategories();
        this.getUnApprovedCategories();
        this.createForm();
    }

    createForm() {
        this.approvalForm = this.fb.group({
            'Id': [''],
            'Reason': [''],
            'IsActive': ['TRUE']
        });
    }

    getAllCategories() {
        this.showLoader = true;
        this.categories = this.merchandiseService.getCategories().
            then((categories) => {
                this.categories = categories.Data;
                this.categoriesFiltered = this.generateTreeStructure(this.categories);
                this.showLoader = false;
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    getUnApprovedCategories() {
        this.showLoader = true;
        this.categories = this.merchandiseService.getUnApprovedCategories().
            then((categories) => {
                this.unApprovedCategories = categories.Data;
                this.showLoader = false;
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    showChildrens(item) {
        item.showChild = !item.showChild;
    }

    generateTreeStructure(array) {
        let tree = [],
            mappedArr = {},
            arrElem,
            mappedElem;

        // First map the nodes of the array to an object -> create a hash table.
        let arrayLength = array.length;
        for (let i = 0; i < arrayLength; i++) {
            arrElem = array[i];
            mappedArr[arrElem.Id] = arrElem;
            mappedArr[arrElem.Id]['SubCategories'] = [];
        }

        for (let Id in mappedArr) {
            if (mappedArr.hasOwnProperty(Id)) {
                mappedElem = mappedArr[Id];
                // If the element is not at the root level, add it to its parent array of children.
                if (mappedElem.ParentCategoryId) {
                    mappedArr[mappedElem['ParentCategoryId']]['SubCategories'].push(mappedElem);
                }
                // If the element is at the root level, add it to first level elements array.
                else {
                    tree.push(mappedElem);
                }
            }
        }
        console.log("tree ", tree);
        return tree;
    }

    searchCategory(searchTerm) {
        if (searchTerm) {
            this.categoriesFiltered = this.categories.filter((item) => {
                const caseInsensitiveSearch = new RegExp(`${searchTerm.trim()}`, "i");
                return caseInsensitiveSearch.test(item.Name);
            });
        } else {
            this.categoriesFiltered = this.generateTreeStructure(this.categories);
        }
    }

    approveCategory(approvalForm, category) {
        console.log("approvalForm ", approvalForm);
        console.log("categoryId ", category);
        category.approvalLoader = true;
    }

    bulkUpload() {
        const activeModal = this.modalService.open(BulkUploadComponent, { size: 'sm' });
    }


}
