import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';
declare let $: any;

import { ProductsService, MerchandiseService, VendorsService, JsonToExcelService } from 'app/services';
import { SellsBulkUploadComponent } from "./bulk-upload/bulk-upload.component";

@Component({
    selector: 'app-seller-products',
    templateUrl: './seller-products.component.html',
    styleUrls: ['./seller-products.component.scss']
})
export class SellerProductsComponent implements OnInit {

    searchProductForm: FormGroup;
    bigLoader = true;
    productSelected = true;
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
    showSelectedDelete = false;
    selectAllCheckbox = false;
    atLeastOnePresent = false;
    vendorId: any;
    vendorInfo: any;
    approvalStatus = ['Pending', 'Approved', 'Rejected'];

    constructor(
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
    }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.searchForm();
        this.getAllProducts();
        this.getAllCategories();
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
        this.merchandiseService.getCategories().
            then((categories) => {
                this.categories = categories.Data;
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    getAllProducts() {
        this.bigLoader = true;
        this.productsService.getProducts().
            then((products) => {
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
        const activeModal = this.modalService.open(SellsBulkUploadComponent, { size: 'sm' });
        activeModal.result.then(status => {
            if (status) {
                this.getAllProducts();
            }
        }).catch(status => { })
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


    approve() {
        this.approveLoader = true;
        this.productsService.sendproductForApproval(this.products)
            .then(res => {
                if (res.Code === 200) {
                    this.getAllProducts();
                    this.toastr.success('Successfully sent for approval.', 'Success');
                } else if (res.Code === 500) {
                    this.toastr.error('Could not send for approval.', 'Error');
                }
                this.approveLoader = false;
            }).catch(err => {
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
            this.productSelected = false;
            item.isChecked = true;
        } else {
            item.isChecked = false;
        }

        let isCheckedArray = [];

        _.forEach(this.products, (item) => {
            if (item.isChecked) {
                this.showSelectedDelete = true;
                isCheckedArray.push(item);
            }
        });

        if (isCheckedArray.length === 0) {
            this.productSelected = true;
            this.showSelectedDelete = false;
        }

    }

    dropDownActionFunction(dropDownActionValue) {
        console.log("dropDownActionValue ", dropDownActionValue);
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
    }


}
