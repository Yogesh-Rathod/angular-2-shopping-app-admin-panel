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

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

    p: number = 1;
    totalRecords: any = 1;
    showRecords: any = 25;
    searchProductForm: FormGroup;
    bigLoader = true;
    approveLoader = false;
    searchLoader = false;
    products: any;
    categories: any;
    status = ['Draft', 'Pending', 'Approved', 'Rejected'];
    vendors: any;
    showSelectedAction = false;
    selectAllCheckbox = false;
    atLeastOnePresent = false;
    vendorId: any;
    vendorInfo: any;
    noActionSelected = false;
    userRole: any;
    disableSubmitButton = false;
    selectAllCheckboxMessage = {
        message: false,
        clearSelection: false
    };
    errorMessage = {
        message: '',
        status: false
    };

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
        if (userRoles.indexOf('SuperAdmin') > -1 || userRoles.indexOf('Admin') > -1) {
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
            this.searchProductForm.controls['e.sellerId'].setValue(this.vendorId);
            this.searchProduct(this.searchProductForm.value);
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
            });
    }

    getAllProducts() {
        this.bigLoader = true;
        this.errorMessage.status = false;
        this.productsService.getOpsProducts(this.userRole, null, 1, this.showRecords).
            then((products) => {
                this.products = products.Data ? products.Data.Products : [] ;
                this.totalRecords = products.Data.TotalRecords;
                this.bigLoader = false;
            }).catch((error) => {
                this.bigLoader = false;
                this.toastr.error('Could not get products', 'Error');
            });
    }

    getAllVendors() {
        this.vendorsService.getVendors().
            then((vendors) => {
                this.vendors = vendors.Data;
            }).catch((error) => {
            })
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
        this.p = 1;
        this.atLeastOneFieldRequires(searchProductForm);
        this.errorMessage.status = false;
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

            this.productsService.getOpsProducts(this.userRole, searchProductForm, 1, this.showRecords).
                then((products) => {
                    this.products = products.Data ? products.Data.Products: [];
                    this.totalRecords = products.Data.TotalRecords;
                    this.bigLoader = false;
                    this.searchLoader = false;
                }).catch((error) => {
                    this.bigLoader = false;
                });

        }
    }

    pageChanged($event) {
        this.bigLoader = true;
        this.p = $event;
        this.productsService.getOpsProducts(this.userRole, null, this.p, this.showRecords).
            then((products) => {
                this.products = products.Data.Products;
                this.totalRecords = products.Data.TotalRecords;
                this.bigLoader = false;
            }).catch((error) => {
                this.bigLoader = false;
            })
    }

    exportAllProducts(searchProductForm) {
        this.searchLoader = true;
        this.errorMessage.status = false;
        if (this.atLeastOneFieldRequires(searchProductForm, true)) {

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

            this.productsService.getOpsProducts(this.userRole, searchProductForm, 1, this.totalRecords).
                then((products) => {
                    products = products.Data ? products.Data.Products : [];
                    if (products.length > 0) {
                        this.jsonToExcelService.exportAsExcelFile(products, 'products');
                    } else {
                        this.errorMessage.message = 'There are no products to export.';
                        this.errorMessage.status = true;
                    }
                    this.searchLoader = false;
                }).catch((error) => {
                    this.searchLoader = false;
                });

        } else {
            this.productsService.getOpsProducts(this.userRole, null, 1, this.totalRecords).
                then((products) => {
                    products = products.Data ? products.Data.Products : [];
                    if (products.length > 0) {
                        this.jsonToExcelService.exportAsExcelFile(products, 'products');
                    } else {
                        this.errorMessage.message = 'There are no products to export.';
                        this.errorMessage.status = true;
                    }
                    this.searchLoader = false;
                }).catch((error) => {
                    this.searchLoader = false;
                    this.toastr.error('Could not get products for export.', 'Error');
                });
        }
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
        const activeModal = this.modalService.open(ProductsBulkUploadComponent, { size: 'sm' });

        activeModal.result.then(status => {
            if (status) {
                this.getAllProducts();
            }
        }).catch(status => { })
    }

    toalRecordsSelected(value) {
        if (value) {
            this.selectAllCheckboxMessage.clearSelection = true;
        } else {
            this.selectAllCheckbox = false;
            this.selectAllCheckboxMessage.message = false;
            this.selectAllCheckboxMessage.clearSelection = false;
            this.selectAllCheckboxMessage.message = false;
            this.noActionSelected = false;
            this.selectAllCheckbox = false;
            _.forEach(this.products, (item) => {
                item.isChecked = false;
            });
            this.showSelectedAction = false;
        }
    }

    selectAll(e) {
        if (e.target.checked) {
            this.selectAllCheckboxMessage.message = true;
            this.selectAllCheckbox = true;
            _.forEach(this.products, (item) => {
                item.isChecked = true;
            });
            this.showSelectedAction = true;
        } else {
            this.selectAllCheckboxMessage.message = false;
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
                case 'Send for approval':
                    this.sendForApproval();
                break;
                case 'Mark out of stock':
                    this.toggleOutOfStock(1);
                break;
                case 'Mark in stock':
                    this.toggleOutOfStock(0);
                break;
                default:
                    break;
            }
        }
    }

    toggleOutOfStock(status) {
        console.log("status ", status);
        this.approveLoader = true;
        let productsToChange = [];
        this.errorMessage.status = false;
        _.forEach(this.products, (item) => {
            if (item.isChecked) {
                if (item.Status === 'Approved') {
                    productsToChange.push(item.Id);
                } else {
                    this.errorMessage.status = true;
                    this.errorMessage.message = 'In order to mark out of stock product status should be Approved.';
                    this.approveLoader = false;
                    $('[data-toggle="tooltip"]').tooltip('hide');
                    return;
                }
            }
        });
        if (!this.errorMessage.status) {
            this.productsService.toggleProductsOutofStock(productsToChange, status)
                .then(res => {
                    if (res.Code === 200) {
                        this.getAllProducts();
                        switch (status) {
                            case 0:
                                this.toastr.success('Successfully marked in stock.', 'Success');
                                break;
                            case 1:
                                this.toastr.success('Successfully marked out of stock.', 'Success');
                                break;
                            default:
                                break;
                        }
                    } else if (res.Code === 500) {
                        switch (status) {
                            case 0:
                                this.toastr.error('Could not mark in stock.', 'Error');
                                break;
                            case 1:
                                this.toastr.error('Could not mark out of stock.', 'Error');
                                break;
                            default:
                                break;
                        }
                    }
                    this.selectAllCheckbox = false;
                    this.showSelectedAction = true;
                    this.approveLoader = false;
                }).catch(err => {
                    this.selectAllCheckbox = false;
                    this.showSelectedAction = true;
                    this.approveLoader = false;
                    switch (status) {
                        case 0:
                            this.toastr.error('Could not mark in stock.', 'Error');
                            break;
                        case 1:
                            this.toastr.error('Could not mark out of stock.', 'Error');
                            break;
                        default:
                            break;
                    }
                });
        }
    }

    sendForApproval() {
        console.log("sendForApproval ");
        // this.productsService.confirmOperationProduct({}}, this.userRole).then(res => {
        //     this.toastr.success('Sucessfully Done!', 'Sucess!');
        // }).catch(err => { })
    }

    rejectAll() {
        this.approveLoader = true;
        let productsToReject = [];
        if (this.selectAllCheckbox) {
            _.forEach(this.products, (item) => {
                if (item.Status === 'Pending') {
                    productsToReject.push(item.Id);
                    item.isChecked = false;
                } else {
                    this.errorMessage.status = true;
                    this.errorMessage.message = 'In order to reject status should be Pending for approval.';
                    this.approveLoader = false;
                    return;
                }
            });
        } else {
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    if (item.isChecked) {
                        if (item.Status === 'Pending') {
                            productsToReject.push(item.Id);
                        } else {
                            this.errorMessage.status = true;
                            this.errorMessage.message = 'In order to reject status should be Pending for approval.';
                            this.approveLoader = false;
                            return;
                        }
                    }
                }
            });
        }
        if (!this.errorMessage.status) {
            this.productsService.rejectProducts(productsToReject, this.userRole).
                then((success) => {
                    if (success.Code === 200) {
                        this.resetForm();
                    }
                    this.approveLoader = false;
                }).catch((error) => {
                    this.approveLoader = false;
                });
            this.selectAllCheckbox = false;
            this.showSelectedAction = false;
        }
    }

    approveAll() {
        this.approveLoader = true;
        this.errorMessage.status = false;
        let productsToApprove = [];
        if (this.selectAllCheckbox) {
            productsToApprove = [];
            _.forEach(this.products, (item) => {
                if (item.Status === 'Pending') {
                    productsToApprove.push(item.Id);
                } else {
                    this.errorMessage.status = true;
                    this.errorMessage.message = 'In order to approve status should be Pending for approval.';
                    this.approveLoader = false;
                    return;
                }
            });
        } else {
            productsToApprove = [];
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    if (item.Status === 'Pending') {
                        productsToApprove.push(item.Id);
                    } else {
                        this.errorMessage.status = true;
                        this.errorMessage.message = 'In order to approve status should be Pending for Approval.';
                        this.approveLoader = false;
                        return;
                    }
                }
            });
        }
        if (!this.errorMessage.status) {
            this.productsService.approveProducts(productsToApprove, this.userRole).
                then((success) => {
                    if (success.Code === 200) {
                        this.resetForm();
                    }
                    this.approveLoader = false;
                }).catch((error) => {
                    this.approveLoader = false;
                })
                this.selectAllCheckbox = false;
                this.showSelectedAction = false;
        }
    }

    resetForm() {
        this.atLeastOnePresent = false;
        this.searchForm();
        this.getAllProducts();
    }

}
