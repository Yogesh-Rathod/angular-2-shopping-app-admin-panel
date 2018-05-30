import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
    FormBuilder
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CsvService } from 'angular2-json2csv';
import { CookieService } from 'ngx-cookie';

import * as _ from 'lodash';
declare let $: any;

import {
    ProductsService,
    MerchandiseService,
    JsonToExcelService,
    VendorsService
} from 'app/services';
import { ProductsBulkUploadComponent } from 'app/pages/merchandise/products/bulk-upload/bulk-upload.component';

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
    searchLoader = false;
    approveLoader = false;
    products: any;
    categories: any;
    status = [
        {
            id: 'Draft',
            itemName: 'Draft'
        },
        {
            id: 'Pending',
            itemName: 'Pending for Approval'
        }
    ];
    vendors: any;
    showSelectedAction = false;
    selectAllCheckbox = false;
    atLeastOnePresent = false;
    vendorId: any;
    vendorInfo: any;
    dropDownAction = ['Approve', 'Reject'];
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
        private vendorsService: VendorsService,
        private merchandiseService: MerchandiseService
    ) {
        this.route.params.subscribe(params => {
            this.vendorId = params['vendorId'];
        });
        let userRoles = this.cookieService.get('userRoles');
        if (
            userRoles.indexOf('SuperAdmin') > -1 ||
            userRoles.indexOf('Admin') > -1
        ) {
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
    }

    searchForm() {
        this.searchProductForm = this.fb.group({
            'e.name': [''],
            'e.sKU': [''],
            'e.parentProductCode': [''],
            'e.status': [''],
            'e.sellerId': ['']
        });
    }

    getAllVendors() {
        this.vendorsService
            .getVendors()
            .then(vendors => {
                this.vendors = vendors.Data;
            })
            .catch(error => {});
    }

    getAllProducts() {
        this.bigLoader = true;
        this.productsService
            .getOpsProducts(this.userRole, null, 1, this.showRecords)
            .then(products => {
                this.products = products.Data ? products.Data.Products : [];
                this.totalRecords = products.Data.TotalRecords;
                this.bigLoader = false;
                if (products.Code === 500) {
                    this.toastr.error('Could not get products.', 'Error');
                }
            })
            .catch(error => {
                this.bigLoader = false;
                this.toastr.error('Could not get products.', 'Error');
            });
    }

    removeBlankFieldsFromForm(FormObject) {
        for (let key in FormObject) {
            if (FormObject.hasOwnProperty(key)) {
                let value = FormObject[key];
                if (!value || value.length === 0) {
                    delete FormObject[key];
                }
                if (typeof FormObject[key] === 'string') {
                    FormObject[key] = FormObject[key].trim();
                }
            }
        }
        FormObject = JSON.stringify(FormObject);
        FormObject = FormObject.replace(/{|}|[\[\]]|/g, '')
            .replace(/":"/g, '=')
            .replace(/","/g, '&')
            .replace(/"/g, '');
        return FormObject;
    }

    searchProduct(searchProductForm) {
        this.p = 1;
        this.atLeastOneFieldRequires(searchProductForm);
        if (!this.atLeastOnePresent) {
            this.products = [];
            this.bigLoader = true;
            searchProductForm = this.removeBlankFieldsFromForm(
                searchProductForm
            );

            this.productsService
                .getOpsProducts(
                    this.userRole,
                    searchProductForm,
                    1,
                    this.showRecords
                )
                .then(products => {
                    this.products = products.Data ? products.Data.Products : [];
                    this.totalRecords = products.Data.TotalRecords;
                    this.bigLoader = false;
                })
                .catch(error => {
                    this.bigLoader = false;
                });
        }
    }

    pageChanged($event) {
        this.bigLoader = true;
        this.p = $event;
        this.atLeastOneFieldRequires(this.searchProductForm.value);
        let searchProductForm;
        if (!this.atLeastOnePresent) {
            searchProductForm = this.removeBlankFieldsFromForm(
                this.searchProductForm.value
            );
        }
        this.productsService
            .getOpsProducts(
                this.userRole,
                searchProductForm,
                this.p,
                this.showRecords
            )
            .then(products => {
                this.products = products.Data ? products.Data.Products : [];
                this.totalRecords = products.Data.TotalRecords;
                this.bigLoader = false;
            })
            .catch(error => {
                this.bigLoader = false;
            });
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

    selectAll(e) {
        if (e.target.checked) {
            this.selectAllCheckbox = true;
            _.forEach(this.products, item => {
                item.isChecked = true;
            });
            this.showSelectedAction = true;
        } else {
            this.noActionSelected = false;
            this.selectAllCheckbox = false;
            _.forEach(this.products, item => {
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

        _.forEach(this.products, item => {
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
            _.forEach(this.products, item => {
                productsToReject.push(item.Id);
                item.isChecked = false;
            });
        } else {
            _.forEach(this.products, item => {
                if (item.isChecked) {
                    productsToReject.push(item.Id);
                    item.isChecked = false;
                }
            });
        }
        this.productsService
            .rejectProducts(productsToReject, this.userRole)
            .then(success => {
                if (success.Code === 200) {
                    this.getAllProducts();
                }
                this.approveLoader = false;
            })
            .catch(error => {
                this.approveLoader = false;
            });
        this.selectAllCheckbox = false;
        this.showSelectedAction = false;
    }

    approveAll() {
        this.approveLoader = true;
        let productsToApprove = [];
        if (this.selectAllCheckbox) {
            productsToApprove = [];
            _.forEach(this.products, item => {
                productsToApprove.push(item.Id);
                item.isChecked = false;
            });
        } else {
            productsToApprove = [];
            _.forEach(this.products, item => {
                if (item.isChecked) {
                    productsToApprove.push(item.Id);
                    item.isChecked = false;
                }
            });
        }
        this.productsService
            .approveProducts(productsToApprove, this.userRole)
            .then(success => {
                if (success.Code === 200) {
                    this.getAllProducts();
                }
                this.approveLoader = false;
            })
            .catch(error => {
                this.approveLoader = false;
            });
        this.selectAllCheckbox = false;
        this.showSelectedAction = false;
    }

    exportAllProducts(searchProductForm) {
        this.searchLoader = true;
        // this.errorMessage.status = false;
        if (this.atLeastOneFieldRequires(searchProductForm)) {
            searchProductForm = this.removeBlankFieldsFromForm(
                searchProductForm
            );

            this.productsService
                .getOpsProducts(
                    this.userRole,
                    searchProductForm,
                    1,
                    this.totalRecords
                )
                .then(products => {
                    products = products.Data ? products.Data.Products : [];
                    if (products.length > 0) {
                        this.jsonToExcelService.exportAsExcelFile(
                            products,
                            `${this.userRole}_products`
                        );
                    } else {
                        // this.errorMessage.message =
                        'There are no products to export.';
                        // this.errorMessage.status = true;
                    }
                    this.searchLoader = false;
                })
                .catch(error => {
                    this.searchLoader = false;
                });
        } else {
            this.productsService
                .getOpsProducts(this.userRole, null, 1, this.totalRecords)
                .then(products => {
                    products = products.Data ? products.Data.Products : [];
                    if (products.length > 0) {
                        this.jsonToExcelService.exportAsExcelFile(
                            products,
                            `${this.userRole}_products`
                        );
                    } else {
                        // this.errorMessage.message =
                        'There are no products to export.';
                        // this.errorMessage.status = true;
                    }
                    this.searchLoader = false;
                })
                .catch(error => {
                    this.searchLoader = false;
                    this.toastr.error(
                        'Could not get products for export.',
                        'Error'
                    );
                });
        }
    }

    bulkUpload(isApprove) {
        const activeModal = this.modalService.open(
            ProductsBulkUploadComponent,
            { size: 'sm' }
        );
        activeModal.componentInstance.userRole = this.userRole;
        activeModal.componentInstance.isApprove = isApprove;

        activeModal.result
            .then(status => {
                if (status) {
                    this.getAllProducts();
                }
            })
            .catch(status => {});
    }

    resetForm() {
        this.atLeastOnePresent = false;
        this.searchForm();
        this.getAllProducts();
    }
}
