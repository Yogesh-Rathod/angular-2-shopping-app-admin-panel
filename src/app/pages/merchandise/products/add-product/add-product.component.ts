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
    subCategories = [];
    subSubCategory = [];

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
        singleSelection: true,
        text: "Select Categories",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: 'col-8 no_padding'
    };
    currencyOptions = ['₹ (INR)', '$ (US)'];
    statusOptions = ['Draft', 'Pending', 'Approved'];
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
            'SubCategories': [[], Validators.required],
            'SubSubCategories': [[], Validators.required],
            'ShortDescription': [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            'FullDescription': [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            'specifications': this.fb.array([this.createControl()]),
            'Status': [
                '',
                Validators.required
            ],
            'CurrencyId': ['₹ (INR)'],
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
            // 'SellerId': [
            //     '',
            //     Validators.required
            // ],
            'RetailPrice': ['', Validators.required],
            'RetailShippingPrice': ['', Validators.required],
            'RetailPriceInclusive': ['', Validators.required],
            'pictureName': [''],
            'pictureAlt': [''],
            'pictureTitle': [''],
            'Type': [],
            'pictureDisplayorder': [''],
            'Brand': [''],
            'Colour': [''],
            'Size': [''],
            'Comments': [''],
            'ManufacturerPartNumber': ['']
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
        this.bigLoader = true;
        if (this.productId) {
            this.productsService.getOpsProductById(productId, this.userRole)
                .then((res) => {
                    this.products = res.Data.Products;
                    if (res.Code != 500) {
                        let specification = this.products[0].ProductSpecification.split('|');
                        let specificationData = [];
                        _.forEach(specification, (data, index) => {
                            let value = data.split(":");
                            specificationData[index] = ({
                                key: value[0],
                                value: value[1]
                            });
                            this.addProductForm.controls['specifications'].setValue(specificationData);
                            this.appendMore();
                        });
                        this.removeStructure(specificationData.length);
                        this.addProductForm.controls['Id'].setValue(this.products[0].Id);
                        this.addProductForm.controls['ParentProductCode'].setValue(this.products[0].ParentProductCode);
                        this.addProductForm.controls['ModelNumber'].setValue(this.products[0].ModelNumber);
                        this.addProductForm.controls['ManufacturerPartNumber'].setValue(this.products[0].ManufacturerPartNumber);
                        this.addProductForm.controls['Gtin'].setValue(this.products[0].Gtin);
                        console.log("this.products ", this.products);
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
                        this.addProductForm.controls['Status'].setValue(this.products[0].Status);
                        this.addProductForm.controls['RetailPrice'].setValue(this.products[0].RetailPrice);
                        this.addProductForm.controls['RetailShippingPrice'].setValue(this.products[0].RetailShippingPrice);
                        this.addProductForm.controls['RetailPriceInclusive'].setValue(this.products[0].RetailPriceInclusive);
                        this.addProductForm.controls['CurrencyId'].setValue('₹ (INR)');
                        this.setCategoriesInEditMode();
                        this.bigLoader = false;
                        this.checkFormValidation();
                    }
                }).catch((error) => {
                    console.log("error ", error);
                })
        }
    }

    setCategoriesInEditMode() {
        const setCategories = setInterval(() => {
            if (this.productId && this.products) {
                const selectedCategory = this.categories.filter((category) => {
                    if (category.Id === this.products[0].CategoryId) {
                        return category;
                    }
                });
                if (selectedCategory && selectedCategory.length > 0) {
                    this.addProductForm.controls['CategoryId'].setValue(selectedCategory);
                }
                this.getSubCategory(2, true);
                this.getSubSubCategory(3, true);
                clearInterval(setCategories);
            }
        }, 1000);
        setCategories;
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
                "ParentProductCode": addProductForm.ParentProductCode,
                "Sku": addProductForm.Sku,
                "Name": addProductForm.Name,
                "ModelNumber": addProductForm.ModelNumber,
                "ShortDescription": addProductForm.ShortDescription,
                "FullDescription": addProductForm.FullDescription,
                "ProductSpecification": specification,
                "Category": addProductForm.CategoryId[0].itemName,
                "SubCategory": addProductForm.SubCategories[0].itemName,
                "SubSubCategory": addProductForm.SubSubCategories[0].itemName,
                "Brand": addProductForm.Brand,
                "Colour": addProductForm.Colour,
                "Size": addProductForm.Size,
                "Type": 'Merchandise',
                "ImageNumber": 0,
                "CurrencyId": addProductForm.CurrencyId,
                "NetPrice": addProductForm.NetPrice,
                "NetShippingPrice": addProductForm.NetShippingPrice,
                "Mrp": addProductForm.Mrp,
                "RetailPrice": addProductForm.RetailPrice,
                "DiscountType":'Static',
                "Discount":0,
                "RetailShippingPrice": addProductForm.RetailShippingPrice,
                "RetailPriceInclusive": addProductForm.RetailPriceInclusive,
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
    sendApproval(addProductForm){
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
                "ParentProductCode": addProductForm.ParentProductCode,
                "Sku": addProductForm.Sku,
                "Name": addProductForm.Name,
                "ModelNumber": addProductForm.ModelNumber,
                "ShortDescription": addProductForm.ShortDescription,
                "FullDescription": addProductForm.FullDescription,
                "ProductSpecification": specification,
                "Category": addProductForm.CategoryId[0].itemName,
                "SubCategory": addProductForm.SubCategories[0].itemName,
                "SubSubCategory": addProductForm.SubSubCategories[0].itemName,
                "Brand": addProductForm.Brand,
                "Colour": addProductForm.Colour,
                "Size": addProductForm.Size,
                "Type": 'Merchandise',
                "ImageNumber": 0,
                "CurrencyId": addProductForm.CurrencyId,
                "DiscountType":'Static',
                "Discount":0,
                "NetPrice": addProductForm.NetPrice,
                "NetShippingPrice": addProductForm.NetShippingPrice,
                "Mrp": addProductForm.Mrp,
                "RetailPrice": addProductForm.RetailPrice,
                "RetailShippingPrice": addProductForm.RetailShippingPrice,
                "RetailPriceInclusive": addProductForm.RetailPriceInclusive,
                "Comments": addProductForm.Comments,
                "ManufacturerPartNumber": addProductForm.ManufacturerPartNumber,
                "Gtin": addProductForm.Gtin,
                "Status": addProductForm.Status
            }
        ]
        this.showLoader = true;
            this.productsService.confirmOperationProduct(res, this.userRole).then(res => {
                this.toastr.success('Sucessfully Done!', 'Sucess!');
                this.showLoader = false;
                this.goBack();
            }).catch(err => { })
    }
    getAllCategories() {
        this.subSubCategory = [];
        this.subCategories = [];
        this.merchandiseService.getCategoriesByLevel(1).
            then((categories) => {
                this.categories = categories.Data;
                this.categories = this.categories.map((category) => {
                    category.id = category.Id;
                    category.itemName = category.Name;
                    return category;
                });
                this.bigLoader = false;
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    getSubCategory(value, isload?) {
        this.addProductForm.controls['SubCategories'].setValue([]);
        this.addProductForm.controls['SubSubCategories'].setValue([]);
        this.merchandiseService.getCategoriesByLevel(2).
            then((categories) => {
                this.subCategories = categories.Data;
                if (this.productId && this.products && isload) {
                    this.subCategories = this.subCategories.map((category) => {
                        category.id = category.Id;
                        category.itemName = category.Name;
                        return category;
                    });
                    const selectedCategory = this.subCategories.filter((category) => {
                        if (category.Id === this.products[0].SubCategoryId) {
                            return category;
                        }
                    });
                    if (selectedCategory && selectedCategory.length > 0) {
                        this.addProductForm.controls['SubCategories'].setValue(selectedCategory);
                    }
                }
                this.subCategories = this.subCategories.filter((category) => {
                    if (category.ParentCategoryId == value.Id) {
                        category.id = category.Id;
                        category.itemName = category.Name;
                        return category
                    }
                });
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    getSubSubCategory(value, isload?) {
        this.merchandiseService.getCategoriesByLevel(3).
            then((categories) => {
                this.subSubCategory = categories.Data;
                if (this.productId && this.products && isload) {
                    this.subSubCategory = this.subSubCategory.map((category) => {
                        category.id = category.Id;
                        category.itemName = category.Name;
                        return category;
                    });
                    const selectedCategory = this.subSubCategory.filter((category) => {
                        if (category.Id === this.products[0].SubSubCategoryId) {
                            return category;
                        }
                    });
                    console.log("selectedCategory ", selectedCategory);
                    if (selectedCategory && selectedCategory.length > 0) {
                        this.addProductForm.controls['SubSubCategories'].setValue(selectedCategory);
                    }
                }
                this.subSubCategory = this.subSubCategory.filter((category) => {
                    if (category.ParentCategoryId == value.Id) {
                        category.id = category.Id;
                        category.itemName = category.Name;
                        return category
                    }
                });
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    clearSubCategory() {
        this.subSubCategory = [];
        this.subCategories = [];
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

    checkFormValidation() {
        for (var i in this.addProductForm.controls) {
            this.addProductForm.controls[i].markAsTouched();
        }
    }

    goBack() {
        this._location.back();
    }

    resetForm() {
        this.createForm();
    }

}
