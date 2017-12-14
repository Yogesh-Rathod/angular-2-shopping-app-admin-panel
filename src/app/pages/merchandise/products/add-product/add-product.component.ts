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

  constructor(
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
      this.bankId = params['bankId'];
      this.vendorId = params['vendorId'];
    });
  }

  ngOnInit() {
    this.createForm();
    this.getAllVendors();
    this.getAllCategories();
    this.getProductInfoForEdit();
    this.bigLoader = false;
  }

  createForm() {
    this.addProductForm = this.fb.group({
      'id': [''],
      'code': [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'productCode': [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'name': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ])
      ],
      'shortDescription': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1000)
        ])
      ],
      'fullDescription': [
        '',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(5000)
        ])
      ],
      'specifications': this.fb.array([this.createControl()]),
      'sku': [
        '',
        Validators.required
      ],
      'status': [
        '',
        Validators.required
      ],
      'currency': [''],
      'netPrice': [
        '',
        Validators.required
      ],
      'netShipping': [
        '',
        Validators.required
      ],
      'MrpPrice': [
        '',
        Validators.required
      ],
      'oldPrice': [''],
      'netTaxes': [''],
      'netTaxes2': [''],
      'applicableDate': [''],
      // 'stockQuantity': [
      //   '',
      //   Validators.required
      // ],
      'categories': [
        [],
        Validators.required
      ],
      'vendor': [
        '',
        Validators.required
      ],
      'pictureName': [''],
      'pictureAlt': [''],
      'pictureTitle': [''],
      'pictureDisplayorder': [''],
      'type': [''],
      'brand': [''],
      'color': [''],
      'size': [''],
      // 'reOrderLevel': [''],
      'comments': ['']
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

  getProductInfoForEdit() {
    if (this.productId) {
      this.products = this.productsService.getProducts();
      _.forEach(this.products, (product) => {
        if (product.id === parseInt(this.productId)) {
          this.productInfo = product;
          console.log("this.productInfo ", this.productInfo);
          this.addProductForm.controls['id'].setValue(product.id);
          this.addProductForm.controls['name'].setValue(product.name);
          this.addProductForm.controls['shortDescription'].setValue(product.shortDescription);
          this.addProductForm.controls['fullDescription'].setValue(product.fullDescription);
          this.addProductForm.controls['sku'].setValue(product.sku);
          this.addProductForm.controls['status'].setValue(product.status);
          this.addProductForm.controls['currency'].setValue(product.currency);
          this.addProductForm.controls['netPrice'].setValue(product.netPrice);
          this.addProductForm.controls['netShipping'].setValue(product.netShipping);
          this.addProductForm.controls['MrpPrice'].setValue(product.MrpPrice);
          this.addProductForm.controls['oldPrice'].setValue(product.MrpPrice);
          // this.addProductForm.controls['retailPrice'].setValue(product.retailPrice);
          // this.addProductForm.controls['retailShipping'].setValue(product.retailShipping);
          // this.addProductForm.controls['rpi'].setValue(product.rpi);
          // this.addProductForm.controls['stockQuantity'].setValue(product.stockQuantity);
          this.addProductForm.controls['vendor'].setValue(product.vendor);
          // this.addProductForm.controls['pictureName'].setValue(product.picture[0].url);
          this.addProductForm.controls['pictureAlt'].setValue(product.picture[0].alt);
          this.addProductForm.controls['pictureTitle'].setValue(product.picture[0].title);
          this.addProductForm.controls['pictureDisplayorder'].setValue(product.picture[0].displayOrder);
          // this.addProductForm.controls['categories'].setValue([product.categories]);
          this.addProductForm.controls['type'].setValue(product.type);
          this.addProductForm.controls['brand'].setValue(product.brand);
        }
      });
    }
  }

  addProduct(addProductForm) {
    this.showLoader = true;
    console.log("addProductForm ", addProductForm);
    let productInfo = {
      id: Math.floor(Math.random() * 90000) + 10000,
      picture: [
        {
          url: this.productImageName ? this.productImageName : undefined,
          alt: addProductForm.pictureAlt ? addProductForm.pictureAlt : undefined,
          title: addProductForm.pictureTitle ? addProductForm.pictureTitle : undefined,
          displayOrder: addProductForm.pictureDisplayorder ? addProductForm.pictureDisplayorder : undefined
        }
      ],
      name: addProductForm.name ? addProductForm.name : undefined,
      shortDescription: addProductForm.shortDescription,
      fullDescription: addProductForm.fullDescription,
      sku: addProductForm.sku,
      MrpPrice: addProductForm.MrpPrice,
      oldPrice: addProductForm.oldPrice,
      vendor: addProductForm.vendor,
      retailPrice: addProductForm.retailPrice,
      // stockQuantity: addProductForm.stockQuantity,
      productType: 'Simple',
      status: addProductForm.status,
      categories: addProductForm.categories
    };

    if (addProductForm.id) {
      productInfo['id'] = addProductForm.id;
      const index = _.findIndex(this.products, { id: productInfo['id'] });
      this.products.splice(index, 1, productInfo);
      this.productsService.editProduct(this.products);
    } else {
      this.productsService.addProduct(productInfo);
    }

    this.toastr.success('Sucessfully Done!', 'Sucess!');
    this.showLoader = false;
    this.goBack();
  }

  getAllCategories() {
    this.categories = this.merchandiseService.getCategories();
    let categoriesArray = [];
    _.forEach(this.categories, (category) => {
      if (category.parent_name) {
        categoriesArray.push({
          id: `${category.parent_name} >> ${category.name}`,
          itemName: `${category.parent_name} >> ${category.name}`
        });
      } else {
        categoriesArray.push({
          id: category.name,
          itemName: category.name
        });
      }
    });
    this.categories = categoriesArray;
  }

  deleteProduct() {
    const activeModal = this.modalService.open(ProductsDeletePopupComponent, { size: 'sm' });
    activeModal.componentInstance.modalText = 'product';

    activeModal.result.then((status) => {
      if (status) {
        this.deleteLoader = true;
        _.remove(this.products, this.productInfo);
        this.productsService.editProduct(this.products);
        this.deleteLoader = false;
        this.goBack();
      }
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
