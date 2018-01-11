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

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddSellerProductComponent implements OnInit {

  addProductForm: FormGroup;
  config = {
    uiColor: '#F0F3F4',
    height: '200',
    toolbarCanCollapse: true
  };
  productId: any;
  products: any;
  productInfo = [];
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
      // 'sku': [
      //   '',
      //   Validators.required
      // ],
      'status': [
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
      // 'stockQuantity': [
      //   '',
      //   Validators.required
      // ],
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
      // 'reOrderLevel': [''],
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

  getProductInfoForEdit() {
    console.log(this.productId)
    if (this.productId) {
      this.productsService.getProductById(this.productId).then(res => {
        this.products = res.Data;
        if (res.code != 500 && this.products != '') {
          this.addProductForm.controls['Id'].setValue(this.products.id);
          this.addProductForm.controls['Name'].setValue(this.products.name);
          this.addProductForm.controls['ShortDescription'].setValue(this.products.shortDescription);
          this.addProductForm.controls['FullDescription'].setValue(this.products.fullDescription);
          this.addProductForm.controls['Sku'].setValue(this.products.sku);
          this.addProductForm.controls['Status'].setValue(this.products.status);
          this.addProductForm.controls['Currency'].setValue(this.products.currency);
          this.addProductForm.controls['NetPrice'].setValue(this.products.netPrice);
          this.addProductForm.controls['NetShipping'].setValue(this.products.netShipping);
          this.addProductForm.controls['MrpPrice'].setValue(this.products.MrpPrice);
          this.addProductForm.controls['Brand'].setValue(this.products.brand);
        }
      }).catch(err => { });
      console.log("this.productInfo ", this.productInfo);
    }
  }

  addProduct(addProductForm) {
    this.showLoader = true;
    let value = []
    addProductForm.specifications = addProductForm.specifications.map((data, index) => {
      value.push(data.key + ':' + data.value)
      return data;
    });
    let val2 = JSON.stringify(value);
    let val3 = val2.replace('[', '')
    let val4 = val3.replace(']', '')
    let specification = val4.replace(',', '|');
    // let Productspecification = specification.replace('"', '');
    // console.log(Productspecification);
    var res = [
      {
        "Id": addProductForm.Id,
        "SellerId": addProductForm.SellerId.id,
        "ParentProductCode": addProductForm.ParentProductCode,
        "Sku": addProductForm.Sku,
        "Name": addProductForm.Name,
        "ModelNumber": addProductForm.ModelNumber,
        "ShortDescription": addProductForm.ShortDescription,
        "FullDescription": addProductForm.FullDescription,
        "ProductSpecification": `${specification}`,
        "CategoryId": "1",
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
    console.log(res);
    this.productsService.addProduct(res).then(res => {
      this.toastr.success('Sucessfully Done!', 'Sucess!');
      this.showLoader = false;
      this.goBack();
    }).catch(err => { this.showLoader = false; })
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
