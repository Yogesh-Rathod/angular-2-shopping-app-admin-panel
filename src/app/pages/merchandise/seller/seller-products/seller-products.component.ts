import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';
declare let $: any;

import { ProductsService, MerchandiseService, JsonToExcelService } from 'app/services';
import { SellsBulkUploadComponent } from "./bulk-upload/bulk-upload.component";

@Component({
    selector: 'app-seller-products',
    templateUrl: './seller-products.component.html',
    styleUrls: ['./seller-products.component.scss']
})
export class SellerProductsComponent implements OnInit {

    p: number = 1;
    totalRecords: any = 1;
    showRecords: any = 25;
    isCheckedArray = [];
    searchProductForm: FormGroup;
    bigLoader = true;
    productSelected = true;
    approveLoader = false;
    searchLoader = false;
    products: any;
    categories: any;
    status = ['Draft', 'Pending', 'Approved'];
    showSelectedDelete = false;
    selectAllCheckbox = false;
    atLeastOnePresent = false;

    constructor(
        private jsonToExcelService: JsonToExcelService,
        public toastr: ToastsManager,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private productsService: ProductsService,
        private route: ActivatedRoute,
        private merchandiseService: MerchandiseService) {
    }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.searchForm();
        this.getAllProducts();
        this.getAllCategories();
    }

    // For Creating Add Category Form
    searchForm() {
        this.searchProductForm = this.fb.group({
            'e.name': [''],
            'e.sKU': [''],
            'e.parentProductCode': [''],
            'e.categoryId': [''],
            'e.status': ['']
        });
    }

    getAllCategories() {
        this.merchandiseService.getCategories().
            then((categories) => {
                this.categories = categories.Data;
            }).catch((error) => {
            });
    }

    getAllProducts() {
        this.bigLoader = true;
        this.productsService.getProducts(null, 1, this.showRecords).
            then((products) => {
                this.products = products.Data ? products.Data.Products : [];
                this.totalRecords = products.Data ? products.Data.TotalRecords : 1;
                this.bigLoader = false;
            }).catch((error) => {
                this.bigLoader = false;
                this.toastr.error('Could not get products', 'Error');
            });
    }

    showEntries(value, searchProductForm) {
        this.showRecords = value;
        if (this.atLeastOneFieldRequires(searchProductForm, true)) {
            this.searchProduct(searchProductForm);
        } else {
            this.getAllProducts();
        }
    }

    atLeastOneFieldRequires(formObject, fromShowEntries = false) {
        if (formObject) {
            for (var key in formObject) {
                if (formObject.hasOwnProperty(key)) {
                    if (formObject[key]) {
                        if (!fromShowEntries) {
                            this.atLeastOnePresent = false;
                        }
                        return true;
                    } else {
                        if (!fromShowEntries) {
                            this.atLeastOnePresent = true;
                        }
                    }
                }
            }
        }
    }

    searchProduct(searchProductForm) {
        this.atLeastOneFieldRequires(searchProductForm);
        this.p = 1;
        if (!this.atLeastOnePresent) {
            this.products = [];
            this.searchLoader = true;
            this.bigLoader = true;

            for (let key in searchProductForm) {
                if (searchProductForm.hasOwnProperty(key)) {
                    let value = searchProductForm[key];
                    if (!value || value.length === 0) {
                        delete searchProductForm[key];
                    }
                    if (typeof searchProductForm[key] === 'string') {
                        searchProductForm[key] = searchProductForm[key].trim();
                    }
                }
            }

            searchProductForm = JSON.stringify(searchProductForm);
            searchProductForm = searchProductForm.replace(/{|}|[\[\]]|/g, '').replace(/":"/g, '=').replace(/","/g, '&').replace(/"/g, '');

            this.productsService.getProducts(searchProductForm, 1, this.showRecords).
                then((products) => {
                    this.products = products.Data.Products;
                    this.totalRecords = products.Data.TotalRecords;
                    this.bigLoader = false;
                    this.searchLoader = false;
                }).catch((error) => {
                    this.toastr.error('Could not get products', 'Error');
                    this.bigLoader = false;
                })

        }
    }

    pageChanged($event) {
        this.bigLoader = true;
        this.p = $event;
        this.productsService.getProducts(null, this.p, this.showRecords).
            then((products) => {
                this.products = products.Data.Products;
                this.totalRecords = products.Data.TotalRecords;
                this.bigLoader = false;
            }).catch((error) => {
                this.toastr.error('Could not get products', 'Error');
                this.bigLoader = false;
            });
    }

    exportProducts() {
        let products = [];
        if (this.selectAllCheckbox) {
            products = this.products;
        } else {
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    products.push(item);
                }
            });
        }
        this.jsonToExcelService.exportAsExcelFile(products, 'products');
    }

    bulkUpload() {
        const activeModal = this.modalService.open(SellsBulkUploadComponent, { size: 'sm' });
        activeModal.result.then(status => {
            if (status) {
                this.getAllProducts();
            }
        }).catch(status => { })
    }


    approve() {
        this.approveLoader = true;
        let productsToConfirm = [];
        _.forEach(this.products, (item) => {
            if (item.isChecked) {
                productsToConfirm.push(item);
                item.isChecked = false;
            }
        });
        this.productsService.sendproductForApproval(productsToConfirm)
            .then(res => {
                if (res.Code === 200) {
                    this.getAllProducts();
                    this.toastr.success('Successfully sent for approval.', 'Success');
                } else if (res.Code === 500) {
                    this.toastr.error('Could not send for approval.', 'Error');
                }
                this.selectAllCheckbox = false;
                this.productSelected = true;
                this.approveLoader = false;
            }).catch(err => {
                this.selectAllCheckbox = false;
                this.productSelected = true;
                this.approveLoader = false;
                this.toastr.error('Could not send for approval.', 'Error');
            })
    }

    selectAll(e) {
        if (e.target.checked) {
            this.productSelected = false;
            this.selectAllCheckbox = true;
            _.forEach(this.products, (item) => {
                item.isChecked = true;
            });
            this.showSelectedDelete = true;
        } else {
            this.productSelected = true;
            this.selectAllCheckbox = false;
            _.forEach(this.products, (item) => {
                item.isChecked = false;
            });
            this.showSelectedDelete = false;
        }
    }

    checkBoxSelected(e, item) {
        this.selectAllCheckbox = false;
        if (e.target.checked) {
            item.isChecked = true;
            this.productSelected = false
        } else {
            item.isChecked = false;
            this.productSelected = true;
        }

        _.forEach(this.products, (item) => {
            if (item.isChecked) {
                this.isCheckedArray.push(item);
            }
        });

    }

    dropDownActionFunction(dropDownActionValue) {
        switch (dropDownActionValue) {
            case 'Approve Selected':
                this.approveAll();
                break;
            case 'Reject Selected':
                this.rejectAll();
                break;
            default:
                break;
        }
    }

    rejectAll() {
        if (this.selectAllCheckbox) {
            _.forEach(this.products, (item) => {
                item.approvalStatus = 'Rejected';
                item.isChecked = false;
            });
        } else {
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    item.approvalStatus = 'Rejected';
                    item.isChecked = false;
                }
            });
        }
        this.selectAllCheckbox = false;
        this.showSelectedDelete = false;
    }

    approveAll() {
        if (this.selectAllCheckbox) {
            _.forEach(this.products, (item) => {
                item.approvalStatus = 'Approved';
                item.isChecked = false;
            });
        } else {
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    item.approvalStatus = 'Approved';
                    item.isChecked = false;
                }
            });
        }
        this.selectAllCheckbox = false;
        this.showSelectedDelete = false;
    }

    resetForm() {
        this.searchForm();
        this.getAllProducts();
        this.atLeastOnePresent = false;
    }


}
