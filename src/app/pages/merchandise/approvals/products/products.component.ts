import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CsvService } from "angular2-json2csv";
import { CookieService } from 'ngx-cookie';

import * as _ from 'lodash';
declare let $: any;

import { ProductsService, MerchandiseService, JsonToExcelService } from 'app/services';
import { ProductsBulkUploadComponent } from 'app/pages/merchandise/products/bulk-upload/bulk-upload.component';


@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

    p: number = 1;
    totalRecords: any = 1;
    searchProductForm: FormGroup;
    bigLoader = true;
    approveLoader = false;
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
    dropDownAction = ['Approve', 'Reject'];
    approvalStatus = ['Pending', 'Approved', 'Rejected'];
    noActionSelected = false;
    disableSubmitButton = false;
    userRole: any;

    constructor(
        private cookieService: CookieService,
        private jsonToExcelService: JsonToExcelService,
        public toastr: ToastsManager,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private productsService: ProductsService,
        private route: ActivatedRoute,
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
        this.getAllCategories();
        this.getAllProducts();
    }

    getAllCategories() {
        this.merchandiseService.getCategories().
            then((categories) => {
                this.categories = categories.Data;
            }).catch((error) => {
                this.toastr.error('Could not get categories.', 'Error');
            });
    }

    getAllProducts() {
        this.bigLoader = true;
        this.productsService.getOpsProducts(this.userRole, null, 1, 10).
            then((products) => {
                this.products = products.Data.Products;
                this.totalRecords = products.Data.TotalRecords;
                this.bigLoader = false;
                if (products.Code === 500) {
                    this.toastr.error('Could not get products.', 'Error');
                }
            }).catch((error) => {
                this.bigLoader = false;
                this.toastr.error('Could not get products.', 'Error');
            });
    }

    pageChanged($event) {
        this.bigLoader = true;
        this.p = $event;
        this.productsService.getOpsProducts(this.userRole, null, this.p, 10).
            then((products) => {
                this.products = products.Data.Products;
                this.totalRecords = products.Data.TotalRecords;
                this.bigLoader = false;
            }).catch((error) => {
                this.bigLoader = false;
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

    exportProducts() {
        let products = [];
        if (this.selectAllCheckbox) {
            this.productsService.getOpsProducts(this.userRole, null, null, this.totalRecords).
                then((products) => {
                    if (products.Data && products.Data.Products.length > 0) {
                        this.jsonToExcelService.exportAsExcelFile(products.Data.Products, 'products');
                    }
                }).catch((error) => {
                    this.toastr.error('Could not get products for export', 'Error');
                });
        } else {
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    products.push(item);
                }
            });
            this.jsonToExcelService.exportAsExcelFile(products, 'products');
        }
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

    actionDropDownSelected(dropDownActionSelect) {
        if (dropDownActionSelect) {
            this.disableSubmitButton = true;
        } else {
            this.disableSubmitButton = false;
        }
    }

    dropDownActionFunction(dropDownActionValue) {
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
                    item.isChecked = false;
                }
            });
        }
        this.productsService.rejectProducts(productsToReject, this.userRole).
            then((success) => {
                if (success.Code === 200) {
                    this.getAllProducts();
                }
                this.approveLoader = false;
            }).catch((error) => {
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
                productsToApprove.push(item.Id);
                item.isChecked = false;
            });
        } else {
            productsToApprove = [];
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    productsToApprove.push(item.Id);
                    item.isChecked = false;
                }
            });
        }
        this.productsService.approveProducts(productsToApprove, this.userRole).
            then((success) => {
                if (success.Code === 200) {
                    this.getAllProducts();
                }
                this.approveLoader = false;
            }).catch((error) => {
                this.approveLoader = false;
            })
        this.selectAllCheckbox = false;
        this.showSelectedAction = false;
    }

}
