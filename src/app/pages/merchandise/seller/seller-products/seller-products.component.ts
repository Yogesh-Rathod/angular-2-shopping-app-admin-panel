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
    recordsDisplayed: any = 25;
    recordsToSkip: any = 1;
    isCheckedArray = [];
    searchProductForm: FormGroup;
    bigLoader = true;
    productSelected = true;
    approveLoader = false;
    searchLoader = false;
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
        },
        {
            id: 'Approved',
            itemName: 'Approved'
        },
        {
            id: 'Rejected',
            itemName: 'Rejected'
        },
    ];
    selectAllCheckbox = false;
    atLeastOnePresent = false;
    errorMessage = {
        message: '',
        status: false
    };
    checkAllCheckboxChange = false;

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
        this.errorMessage.status = false;
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

    exportAllProducts(searchProductForm) {
        this.searchLoader = true;
        this.errorMessage.status = false;
        if (this.atLeastOneFieldRequires(searchProductForm, true)) {
            searchProductForm = this.removeBlankFieldsFromForm(searchProductForm);
            this.productsService.getProductsForExport(searchProductForm, 1, this.totalRecords).
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
                    this.toastr.error('Could not get products for export.', 'Error');
                    this.searchLoader = false;
                })

        } else {
            this.productsService.getProductsForExport(null, 1, this.totalRecords).
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

    toggleOutOfStock(status) {
        this.approveLoader = true;
        let productsToChange = [];
        this.errorMessage.status = false;
        let searchProductForm: any = {};
        if (this.checkAllCheckboxChange) {
            searchProductForm = this.searchProductForm.value;
            searchProductForm['e.isCheckAll'] = "true";
            searchProductForm = this.removeBlankFieldsFromForm(searchProductForm);
        }
        _.forEach(this.products, (item) => {
            if (item.isChecked) {
                if (item.Status === 'Approved' || item.Status === 'APPROVED') {
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
            const productsForStockChange = {
                Ids: productsToChange
            };
            this.productsService.toggleProductsOutofStock(productsForStockChange, status, searchProductForm)
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
                    this.productSelected = true;
                    this.approveLoader = false;
                    this.checkAllCheckboxChange = false;
                    $('[data-toggle="tooltip"]').tooltip('hide');
                }).catch(err => {
                    this.selectAllCheckbox = false;
                    this.productSelected = true;
                    this.approveLoader = false;
                    this.checkAllCheckboxChange = false;
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
                    $('[data-toggle="tooltip"]').tooltip('hide');
                });
            }
    }

    showEntries(value, searchProductForm) {
        this.showRecords = value;
        this.p = 1;
        this.recordsToSkip = 1;
        this.recordsDisplayed = this.showRecords;
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
        FormObject = FormObject.replace(/{|}|[\[\]]|/g, '').replace(/":"/g, '=').replace(/","/g, '&').replace(/"/g, '');
        return FormObject;
    }

    searchProduct(searchProductForm) {
        this.atLeastOneFieldRequires(searchProductForm);
        this.p = 1;
        this.recordsToSkip = 1;
        this.recordsDisplayed = this.showRecords;
        this.errorMessage.status = false;
        if (!this.atLeastOnePresent) {
            this.products = [];
            this.searchLoader = true;
            this.bigLoader = true;
            searchProductForm = this.removeBlankFieldsFromForm(searchProductForm);

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
            this.recordsToSkip = this.p > 1 ? ((this.p -1) * this.showRecords) + 1 : 1;
            this.recordsDisplayed = this.p * this.showRecords;
    }

    exportProducts() {
        let products = [];
        if (this.selectAllCheckbox) {
            products = this.products;
            _.forEach(products, (item) => {
                delete item.ImageNumber; delete item.CurrencyId; delete item.RetailPrice; delete item.RetailShippingPrice; delete item.RetailPriceInclusive; delete item.Discount; delete item.Id; delete item.SellerId; delete item.TypeId; delete item.CategoryId; delete item.SubCategoryId; delete item.SubSubCategoryId; delete item.ProcessingStatus; delete item.Errors; delete item.isChecked; delete item.DiscountType;
            });
        } else {
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    delete item.ImageNumber; delete item.CurrencyId; delete item.RetailPrice; delete item.RetailShippingPrice; delete item.RetailPriceInclusive; delete item.Discount; delete item.Id; delete item.SellerId; delete item.TypeId; delete item.CategoryId; delete item.SubCategoryId; delete item.SubSubCategoryId; delete item.ProcessingStatus; delete item.Errors; delete item.isChecked; delete item.DiscountType;
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

    checkAllProductsCheckboxChange(e) {
        if (e.target.checked) {
            this.productSelected = false;
            if (!this.selectAllCheckbox) {
                const element = document.getElementById('selectAllCheckbox') as HTMLElement;
                element.click();
            }
        } else {
            if (this.selectAllCheckbox) {
                const element = document.getElementById('selectAllCheckbox') as HTMLElement;
                element.click();
            }
            this.isCheckedArray = [];
            _.forEach(this.products, (item) => {
                if (item.isChecked) {
                    this.isCheckedArray.push(item);
                }
            });
            if (this.isCheckedArray.length === 0 && !this.checkAllCheckboxChange) {
                this.productSelected = true;
            } else {
                this.productSelected = false;
            }
        }
    }

    sendForApproval() {
        this.approveLoader = true;
        this.errorMessage.status = false;
        let productsToConfirm = [];
        _.forEach(this.products, (item) => {
            if (item.isChecked) {
                if (item.Status === 'Draft') {
                    productsToConfirm.push(item);
                } else {
                    this.errorMessage.status = true;
                    this.errorMessage.message = 'In order to send for approval product status should be draft.';
                    this.approveLoader = false;
                    $('[data-toggle="tooltip"]').tooltip('hide');
                    return;
                }
            }
        });
        let searchProductForm: any = {};
        if (this.checkAllCheckboxChange) {
            searchProductForm = this.searchProductForm.value;
            searchProductForm['e.isCheckAll'] = "true";
            searchProductForm = this.removeBlankFieldsFromForm(searchProductForm);
        }
        if (!this.errorMessage.status) {
            $('[data-toggle="tooltip"]').tooltip('hide');
            this.productsService.sendproductForApproval(productsToConfirm, searchProductForm)
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
                    this.checkAllCheckboxChange = false;
                }).catch(err => {
                    this.checkAllCheckboxChange = false;
                    this.selectAllCheckbox = false;
                    this.productSelected = true;
                    this.approveLoader = false;
                    this.toastr.error('Could not send for approval.', 'Error');
                });
        }
    }

    selectAll(e) {
        if (e.target.checked) {
            this.productSelected = false;
            this.selectAllCheckbox = true;
            _.forEach(this.products, (item) => {
                item.isChecked = true;
            });
        } else {
            this.selectAllCheckbox = false;
            _.forEach(this.products, (item) => {
                item.isChecked = false;
            });
            if (!this.checkAllCheckboxChange) {
                this.productSelected = true;
            }
        }
    }

    checkBoxSelected(e, item) {
        this.selectAllCheckbox = false;
        if (e.target.checked) {
            item.isChecked = true;
        } else {
            item.isChecked = false;
        }
        this.isCheckedArray = [];
        _.forEach(this.products, (item) => {
            if (item.isChecked) {
                this.isCheckedArray.push(item);
            }
        });
        if (this.isCheckedArray.length === 0 && !this.checkAllCheckboxChange) {
            this.productSelected = true;
        } else {
            this.productSelected = false;
        }

    }

    resetForm() {
        this.searchForm();
        this.getAllProducts();
        this.atLeastOnePresent = false;
    }


}
