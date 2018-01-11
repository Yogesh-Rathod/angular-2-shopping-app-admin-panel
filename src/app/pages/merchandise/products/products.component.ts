import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as json2csv from 'json2csv';
import { CsvService } from "angular2-json2csv";

import * as _ from 'lodash';
declare let $: any;

import { ProductsService, MerchandiseService, VendorsService } from 'app/services';
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
    showSelectedDelete = false;
    selectAllCheckbox = false;
    atLeastOnePresent = false;
    vendorId: any;
    vendorInfo: any;
    dropDownAction = ['Deactivate Selected', 'Approve Selected', 'Reject Selected'];
    approvalStatus = ['Pending', 'Approved', 'Rejected'];

    constructor(
        private csvService: CsvService,
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
        // this.getAllCategories();
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
        this.productsService.getOpsProducts().
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
        console.log("this.products ", this.products);

        var fields = ['approvalStatus', 'name', 'MrpPrice', 'status'];
        try {
            this.csvService.download(this.products, 'this.products');
            var result = json2csv({ data: this.products, fields: fields });
            console.log(result);
        } catch (err) {
            // Errors are thrown for bad options, or if the data is empty and no fields are provided.
            // Be sure to provide fields if it is possible that your data array will be empty.
            console.error(err);
        }
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
            this.showSelectedDelete = true;
        } else {
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
            this.showSelectedDelete = false;
        }

    }

    dropDownActionFunction(dropDownActionValue) {
        console.log("dropDownActionValue ", dropDownActionValue);
        switch (dropDownActionValue) {
            case 'Delete Selected':
                this.deleteAll();
                break;
            case 'Deactivate Selected':
                this.deactivateAll();
                break;
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
            let productsToApprove = [];
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    productsToApprove.push(item.Id);
                    // item.approvalStatus = 'Approved';
                    item.isChecked = false;
                }
            });
            this.productsService.approveProducts(productsToApprove).
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
        this.showSelectedDelete = false;
    }


    deactivateAll() {
        if (this.selectAllCheckbox) {
            _.forEach(this.products, (item) => {
                item.status = 'Inactive';
                item.isChecked = false;
            });
        } else {
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    item.status = 'Inactive';
                    item.isChecked = false;
                }
            });
        }
        this.selectAllCheckbox = false;
        this.showSelectedDelete = false;
    }

    deleteAll() {
        if (this.showSelectedDelete || this.selectAllCheckbox) {
            const activeModal = this.modalService.open(ProductsDeletePopupComponent, { size: 'sm' });
            activeModal.componentInstance.modalText = 'products';

            activeModal.result.then((status) => {
                if (status) {
                    if (this.selectAllCheckbox) {
                        this.products = [];
                    } else {
                        _.forEach(this.products, (item) => {
                            if (item) {
                                if (item.isChecked) {
                                    _.remove(this.products, item);
                                }
                            }
                        });
                        this.productsService.editProduct(this.products);
                    }
                    this.toastr.success('Successfully Deleted!', 'Success!');
                    this.selectAllCheckbox = false;
                    this.showSelectedDelete = false;
                }
            });
        }
    }

    // deleteProduct(item, index) {
    //   const activeModal = this.modalService.open(ProductsDeletePopupComponent, { size: 'sm' });
    //   activeModal.componentInstance.modalText = 'product';

    //   activeModal.result.then((status) => {
    //     if (status) {
    //       this.deleteLoader = index;
    //       _.remove(this.products, item);
    //       this.productsService.editProduct(this.products);
    //       this.deleteLoader = NaN;
    //       this.toastr.success('Successfully Deleted!', 'Success!');
    //     }
    //   });
    // }

    resetForm() {
        this.searchForm();
    }

}
