import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import './ckeditor.loader';
import 'ckeditor';
import { IMyDpOptions } from 'mydatepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie';

import { RegEx } from 'app/pages/regular-expressions';
import { MerchandiseService, ProductsService, VendorsService } from 'app/services';
import { ProductsDeletePopupComponent } from '../delete-popup/delete-popup.component';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

    addProductForm: FormGroup;
    config = {
        uiColor: '#F0F3F4',
        height: '200',
        toolbarCanCollapse: true
    };
    productId: any;
    products: any;
    productInfo: any;
    showLoader = false;
    deleteLoader = false;
    categories = [];
    vendors: any;
    categoriesDropdownSettings = {
        singleSelection: false,
        text: "Select Categories",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: 'col-8 no_padding'
    };
    currencyOptions = ['₹ (INR)', '$ (US)'];
    statusOptions = ['Active', 'Inactive', 'Banned', 'Out of stock'];
    bigLoader = true;
    productImageName;
    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        editableDateField: false,
        openSelectorOnInputClick: true
    };
    bankId: any;
    vendorId: any;
    specifications: any = [];
    approvalStatus = ['Pending', 'Approved', 'Rejected'];
    userRole: any;

    constructor(
        private cookieService: CookieService,
        private modalService: NgbModal,
        public toastr: ToastsManager,
        private _location: Location,
        private fb: FormBuilder,
        private productsService: ProductsService,
        private merchandiseService: MerchandiseService,
        private vendorsService: VendorsService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.params.subscribe((params) => {
            this.productId = params['productId'];
        });
        let userRoles = this.cookieService.get('userRoles');
        if (userRoles.indexOf('SuperAdmin') > -1) {
            this.userRole = 'Admin';
        } else {
            this.userRole = 'Operations';
        }
    }

    ngOnInit() {
        this.createForm();
        this.getAllVendors();
        this.getAllCategories();
        this.bigLoader = false;
        if (this.productId) {
            this.getProductInfoForEdit(this.productId);
        }
    }

    createForm() {
        this.addProductForm = this.fb.group({
            'Id': [''],
            'ModelNumber': [''],
            'Gtin': [''],
            'Sku': [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            'ParentProductCode': [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            'Name': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(100)
                ])
            ],
            'ShortDescription': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(1000)
                ])
            ],
            'FullDescription': [
                '',
                Validators.compose([
                    Validators.minLength(1),
                    Validators.maxLength(5000)
                ])
            ],
            'specifications': this.fb.array([this.createControl()]),
            'Status': [
                '',
                Validators.required
            ],
            'CurrencyId': [''],
            'NetPrice': [
                '',
                Validators.required
            ],
            'NetShippingPrice': [
                '',
                Validators.required
            ],
            'Mrp': [
                '',
                Validators.required
            ],
            'netTaxes': [''],
            'netTaxes2': [''],
            'CategoryId': [
                [],
                Validators.required
            ],
            'SellerId': [
                '',
                Validators.required
            ],
            'pictureName': [''],
            'pictureAlt': [''],
            'pictureTitle': [''],
            'pictureDisplayorder': [''],
            'Brand': [''],
            'Colour': [''],
            'Size': [''],
            'Comments': [''],
            'ManufacturerPartNumber': [''],
            'approvalStatus': ['Pending']
        });
    }

    appendMore() {
        this.specifications = this.addProductForm.get('specifications') as FormArray;
        this.specifications.push(this.createControl());
    }

    removeStructure(index) {
        const arrayControl = <FormArray>this.addProductForm.controls['specifications'];
        arrayControl.removeAt(index);
    }

    get specificationsFunction(): FormGroup {
        return this.addProductForm.get('specifications') as FormGroup;
    }

    createControl() {
        return this.fb.group({
            key: ['', Validators.required],
            value: ['', Validators.required]
        });
    }

    validatenumber(e) {
        if (!RegEx.Numbers.test(`${e.key}`) && `${e.key}`.length === 1) {
            e.preventDefault();
        }
    }

    getAllVendors() {
        this.vendors = this.vendorsService.getVendors();
    }

    getProductInfoForEdit(productId) {
        if (this.productId) {
            this.productsService.getOpsProductById(productId, this.userRole)
                .then((res) => {
                    this.products = res.Data;
                    if (res.code != 500) {

                        this.addProductForm.controls['Id'].setValue(this.products[0].Id);
                        this.addProductForm.controls['ParentProductCode'].setValue(this.products[0].ParentProductCode);
                        this.addProductForm.controls['ModelNumber'].setValue(this.products[0].ModelNumber);
                        this.addProductForm.controls['ManufacturerPartNumber'].setValue(this.products[0].ManufacturerPartNumber);
                        this.addProductForm.controls['Gtin'].setValue(this.products[0].Gtin);
                        this.addProductForm.controls['Name'].setValue(this.products[0].Name);
                        this.addProductForm.controls['Comments'].setValue(this.products[0].Comments);
                        this.addProductForm.controls['ShortDescription'].setValue(this.products[0].ShortDescription);
                        this.addProductForm.controls['Colour'].setValue(this.products[0].Colour);
                        this.addProductForm.controls['NetPrice'].setValue(this.products[0].NetPrice);
                        this.addProductForm.controls['NetShippingPrice'].setValue(this.products[0].NetShippingPrice);
                        this.addProductForm.controls['Mrp'].setValue(this.products[0].Mrp);
                        this.addProductForm.controls['Brand'].setValue(this.products[0].Brand);
                        this.addProductForm.controls['Size'].setValue(this.products[0].Size);
                        this.addProductForm.controls['FullDescription'].setValue(this.products[0].FullDescription);
                        this.addProductForm.controls['Sku'].setValue(this.products[0].Sku);
                        this.addProductForm.controls['CurrencyId'].setValue(this.products[0].CurrencyId);
                        // this.addProductForm.controls['CategoryId'].setValue(this.products[0].CategoryId);
                        this.addProductForm.controls['Status'].setValue(this.products[0].Status);
                    }
                }).catch((error) => {
                    console.log("error ", error);
                })
        }
    }

    addProduct(addProductForm) {
        let value = '';
        addProductForm.specifications = addProductForm.specifications.map((data, index) => {
            if (index == 0) {
                value = data.key + ':' + data.value
            }
            else {
                let value2 = "|" + data.key + ':' + data.value
                value = value.concat(value2);
            }
            return data;
        });
        let specification = value;
        let res = [
            {
                "Id": addProductForm.Id,
                "SellerId": addProductForm.SellerId.id,
                "ParentProductCode": addProductForm.ParentProductCode,
                "Sku": addProductForm.Sku,
                "Name": addProductForm.Name,
                "ModelNumber": addProductForm.ModelNumber,
                "ShortDescription": addProductForm.ShortDescription,
                "FullDescription": addProductForm.FullDescription,
                "ProductSpecification": specification,
                "CategoryId": addProductForm.CategoryId[0].Id,
                "Brand": addProductForm.Brand,
                "Colour": addProductForm.Colour,
                "Size": addProductForm.Size,
                "ImageNumber": 0,
                "CurrencyId": addProductForm.CurrencyId,
                "NetPrice": addProductForm.NetPrice,
                "NetShippingPrice": addProductForm.NetShippingPrice,
                "Mrp": addProductForm.Mrp,
                "Comments": addProductForm.Comments,
                "ManufacturerPartNumber": addProductForm.ManufacturerPartNumber,
                "Gtin": addProductForm.Gtin,
                "Status": addProductForm.Status
            }
        ]

        this.showLoader = true;
        if (this.productId) {
            this.productsService.editOperationProduct(res, this.userRole).then(res => {
                this.toastr.success('Sucessfully Done!', 'Sucess!');
                this.showLoader = false;
                this.goBack();
            }).catch(err => { })
        }
        if (addProductForm.id) {
        }
    }

    getAllCategories() {
        this.merchandiseService.getCategoriesByLevel(3).
            then((categories) => {
                this.categories = categories.Data;
                this.categories = this.categories.map((category) => {
                    category.id = category.Id;
                    category.itemName = category.Name;
                    return category;
                })
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    uploadProductImage(addProductForm) {
        console.log("addProductForm ", addProductForm);
    }

    productImageSelected(image) {
        if (image.target.files.length > 0) {
            this.productImageName = image.target.files[0].name;
        } else {
            this.productImageName = '';
        }
    }

    goBack() {
        this._location.back();
    }

    resetForm() {
        this.createForm();
    }

}
