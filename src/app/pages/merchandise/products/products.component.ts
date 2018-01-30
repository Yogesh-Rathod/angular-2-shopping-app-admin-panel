import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CsvService } from "angular2-json2csv";
import { CookieService } from 'ngx-cookie';

import * as _ from 'lodash';
declare let $: any;

import { ProductsService, MerchandiseService, VendorsService, JsonToExcelService } from 'app/services';
import { ProductsBulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { ProductsDeletePopupComponent } from './delete-popup/delete-popup.component';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

    searchProductForm: FormGroup;
    bigLoader = true;
    approveLoader = false;
    searchLoader = false;
    products: any;
    categories: any;
    status = ['Draft', 'Pending', 'APPROVED'];
    vendors: any;
    showSelectedAction = false;
    selectAllCheckbox = false;
    atLeastOnePresent = false;
    vendorId: any;
    vendorInfo: any;
    dropDownAction = ['Approve', 'Reject'];
    approvalStatus = ['Pending', 'Approved', 'Rejected'];
    noActionSelected = false;
    userRole: any;

    constructor(
        private cookieService: CookieService,
        private jsonToExcelService: JsonToExcelService,
        public toastr: ToastsManager,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private productsService: ProductsService,
        private route: ActivatedRoute,
        private vendorsService: VendorsService,
        private merchandiseService: MerchandiseService) {
        this.route.params.subscribe((params) => {
            this.vendorId = params['vendorId'];
        });
        let userRoles = this.cookieService.get('userRoles');
        if (userRoles.indexOf('SuperAdmin') > -1) {
            this.userRole = 'Admin';
        } else {
            this.userRole = 'Operations';
        }
    }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.searchForm();
        this.getAllCategories();
        this.getAllProducts();
        this.getAllVendors();
        if (this.vendorId) {
            this.searchProductForm.controls['vendor'].setValue(this.vendorId);
        }
    }

    // For Creating Add Category Form
    searchForm() {
        this.searchProductForm = this.fb.group({
            'e.name': [''],
            'e.sKU': [''],
            'e.parentProductCode': [''],
            'e.categoryId': [''],
            'e.status': [''],
            'e.sellerId': ['']
        });
    }

    getAllCategories() {
        this.merchandiseService.getCategories().
            then((categories) => {
                this.categories = categories.Data;
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    getAllProducts() {
        this.bigLoader = true;
        this.productsService.getOpsProducts(this.userRole).
            then((products) => {
                console.log("products ", products);
                this.products = products.Data;
                this.bigLoader = false;
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    getAllVendors() {
        this.vendorsService.getVendors().
            then((vendors) => {
                console.log("vendors ", vendors);
                this.vendors = vendors.Data;
                // this.filteredVendorsList = this.vendorsList;
                // this.bigLoader = false;
            }).catch((error) => {
                console.log("error ", error);
            })
    }

    atLeastOneFieldRequires(someObject) {
        if (someObject) {
            for (var key in someObject) {
                if (someObject.hasOwnProperty(key)) {
                    if (someObject[key]) {
                        this.atLeastOnePresent = false;
                        return;
                    } else {
                        this.atLeastOnePresent = true;
                    }
                }
            }
        }
    }

    searchProduct(searchProductForm) {
        console.log('searchProductForm', searchProductForm);
        this.atLeastOneFieldRequires(searchProductForm);
        if (!this.atLeastOnePresent) {
            console.log('searchProductForm', searchProductForm);
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
            console.log("searchProductForm ", searchProductForm);

            this.productsService.getProducts(searchProductForm).
                then((products) => {
                    console.log("products ", products);
                    this.products = products.Data;
                    this.bigLoader = false;
                    this.searchLoader = false;
                }).catch((error) => {
                    this.bigLoader = false;
                    console.log("error ", error);
                })

        }
    }

    exportProducts() {
        let products = [];
        if (this.selectAllCheckbox) {
            console.log("this.selectAllCheckbox ", this.selectAllCheckbox);
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
        const activeModal = this.modalService.open(ProductsBulkUploadComponent, { size: 'sm' });

        activeModal.result.then(status => {
            if (status) {
                this.getAllProducts();
            }
        }).catch(status => { })
    }

    selectAll(e) {
        if (e.target.checked) {
            this.selectAllCheckbox = true;
            _.forEach(this.products, (item) => {
                item.isChecked = true;
            });
            this.showSelectedAction = true;
        } else {
            this.noActionSelected = false;
            this.selectAllCheckbox = false;
            _.forEach(this.products, (item) => {
                item.isChecked = false;
            });
            this.showSelectedAction = false;
        }
    }

    checkBoxSelected(e, item) {
        this.selectAllCheckbox = false;
        if (e.target.checked) {
            item.isChecked = true;
        } else {
            this.noActionSelected = false;
            item.isChecked = false;
        }

        let isCheckedArray = [];

        _.forEach(this.products, (item) => {
            if (item.isChecked) {
                this.showSelectedAction = true;
                isCheckedArray.push(item);
            }
        });

        if (isCheckedArray.length === 0) {
            this.showSelectedAction = false;
        }

    }

    dropDownActionFunction(dropDownActionValue) {
        console.log("value", dropDownActionValue);
        if (!dropDownActionValue) {
            this.noActionSelected = true;
        } else {
            this.noActionSelected = false;
            switch (dropDownActionValue) {
                case 'Approve':
                    this.approveAll();
                    break;
                case 'Reject':
                    this.rejectAll();
                    break;
                default:
                    break;
            }
        }
        console.log("dropDownActionValue ", dropDownActionValue);
    }

    rejectAll() {
        this.approveLoader = true;
        let productsToReject = [];
        if (this.selectAllCheckbox) {
            _.forEach(this.products, (item) => {
                item.approvalStatus = 'Approved';
                productsToReject.push(item.Id);
                item.isChecked = false;
            });
        } else {
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    productsToReject.push(item.Id);
                    // item.approvalStatus = 'Approved';
                    item.isChecked = false;
                }
            });
        }
            this.productsService.rejectProducts(productsToReject, this.userRole).
                then((success) => {
                    console.log("success ", success);
                    if (success.Code === 200) {
                        this.getAllProducts();
                    }
                    this.approveLoader = false;
                }).catch((error) => {
                    console.log("error ", error);
                    this.approveLoader = false;
                })
        this.selectAllCheckbox = false;
        this.showSelectedAction = false;
    }

    approveAll() {
        this.approveLoader = true;
        let productsToApprove = [];
        if (this.selectAllCheckbox) {
            productsToApprove = [];
            _.forEach(this.products, (item) => {
                // item.approvalStatus = 'Approved';
                productsToApprove.push(item.Id);
                item.isChecked = false;
            });
        } else {
            productsToApprove = [];
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    productsToApprove.push(item.Id);
                    // item.approvalStatus = 'Approved';
                    item.isChecked = false;
                }
            });
        }
        this.productsService.approveProducts(productsToApprove, this.userRole).
            then((success) => {
                console.log("success ", success);
                if (success.Code === 200) {
                    this.getAllProducts();
                }
                this.approveLoader = false;
            }).catch((error) => {
                console.log("error ", error);
                this.approveLoader = false;
            })
        this.selectAllCheckbox = false;
        this.showSelectedAction = false;
    }

    resetForm() {
        this.searchForm();
        this.getAllProducts();
    }

}
