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
    deleteLoader: Number;
    products: any;
    categories: any;
    productTypes = [
        'simple',
        'grouped (product with variants)'
    ];
    manufacturer = ['apple', 'lenovo', 'samsung'];
    status = ['Active', 'Inactive', 'Banned', 'Out of stock'];
    vendors: any;
    showSelectedAction = false;
    selectAllCheckbox = false;
    atLeastOnePresent = false;
    vendorId: any;
    vendorInfo: any;
    dropDownAction = ['Approve Selected', 'Reject Selected'];
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
        this.getAllProducts();
        this.getAllVendors();
        if (this.vendorId) {
            this.getVendorInfo(this.vendorId);
        }
    }

    // For Creating Add Category Form
    searchForm() {
        this.searchProductForm = this.fb.group({
            name: [''],
            code: [''],
            parentCode: [''],
            category: [''],
            productType: [''],
            manufacturer: [''],
            status: [''],
            vendor: [''],
            approvalStatus: ['']
        });
    }

    getAllCategories() {
        this.categories = this.merchandiseService.getCategories();
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
        this.vendors = this.vendorsService.getVendors();
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
    }

    getVendorInfo(vendorId) {
        const vendors = this.vendorsService.getVendors();
        _.forEach(vendors, (vendor) => {
            if (parseInt(vendor.id) === parseInt(vendorId)) {
                this.vendorInfo = vendor;
                console.log("this.vendorInfo", this.vendorInfo);
                this.searchProductForm.controls['vendor'].setValue(vendor);
            }
        });
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
        if (!dropDownActionValue) {
            this.noActionSelected = true;
        } else {
            this.noActionSelected = false;
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
        console.log("dropDownActionValue ", dropDownActionValue);
    }

    rejectAll() {
        if (this.selectAllCheckbox) {
            _.forEach(this.products, (item) => {
                item.approvalStatus = 'Approved';
                item.isChecked = false;
            });
        } else {
            let productsToReject = [];
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    productsToReject.push(item.Id);
                    // item.approvalStatus = 'Approved';
                    item.isChecked = false;
                }
            });
            this.productsService.rejectProducts(productsToReject, this.userRole).
                then((success) => {
                    console.log("success ", success);
                    if (success.Code === 200) {
                        this.getAllProducts();
                    }

                }).catch((error) => {
                    console.log("error ", error);

                })
            console.log("productsToReject ", productsToReject);
        }
        this.selectAllCheckbox = false;
        this.showSelectedAction = false;
    }

    approveAll() {
        if (this.selectAllCheckbox) {
            _.forEach(this.products, (item) => {
                item.approvalStatus = 'Approved';
                item.isChecked = false;
            });
        } else {
            let productsToApprove = [];
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    productsToApprove.push(item.Id);
                    // item.approvalStatus = 'Approved';
                    item.isChecked = false;
                }
            });
            this.productsService.approveProducts(productsToApprove, this.userRole).
                then((success) => {
                    console.log("success ", success);
                    if (success.Code === 200) {
                        this.getAllProducts();
                    }

                }).catch((error) => {
                    console.log("error ", error);

                })
            console.log("productsToApprove ", productsToApprove);
        }
        this.selectAllCheckbox = false;
        this.showSelectedAction = false;
    }

    resetForm() {
        this.searchForm();
    }

}
