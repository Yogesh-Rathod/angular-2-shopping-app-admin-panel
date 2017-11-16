import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import './ckeditor.loader';
import 'ckeditor';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

import { VendorsService } from 'app/services';
import { RegEx } from './../../../regular-expressions';
import { VendorDeletePopupComponent } from '../delete-popup/delete-popup.component';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {

  vendorId: any;
  addVendorForm: FormGroup;
  public config = {
    uiColor: '#F0F3F4',
    height: '200'
  };
  deleteLoader = false;
  showLoader = false;
  vendors: any;
  vendorInfo: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _location: Location,
    private vendorsService: VendorsService,
    private toastr: ToastsManager,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params =>
      this.vendorId = params['vendorId']
    )
  }

  ngOnInit() {
    $(document).ready(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.createForm();
    this.getAllVendors();
    this.getVendorInfoForEdit();
  }

  createForm() {
    this.addVendorForm = this.fb.group({
      'id': [''],
      'first_name': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ])
      ],
      'last_name': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ])
      ],
      "suffix": [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ])
      ],
      "company": [''],
      'email': [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(RegEx.Email)
        ])
      ],
      "phone": [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(RegEx.phoneNumber)
        ])
      ],
      "website": [
        '',
        Validators.compose([
          Validators.pattern(RegEx.websiteUrl)
        ])
      ],
      "listingFee": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "address": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "city": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "state": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "country": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "zip": [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(RegEx.zipCode)
        ])
      ],
      'status': [
        '',
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  getAllVendors() {
    this.vendors = this.vendorsService.getVendors();
  }

  validatenumber(e) {
    if (!RegEx.Numbers.test(`${e.key}`) && `${e.key}`.length === 1) {
      e.preventDefault();
    }
  }

  addVendor(addVendorForm) {
    this.showLoader = true;
    if (addVendorForm.id) {
      const index = _.findIndex(this.vendors, { id: addVendorForm['id'] });
      this.vendors.splice(index, 1, addVendorForm);
      this.vendorsService.editVendor(this.vendors);
    } else {
      addVendorForm['id'] = Math.floor(Math.random() * 90000) + 10000;
      this.vendorsService.addVendor(addVendorForm);
    }
    this.toastr.success('Sucessfully Done!', 'Sucess!');
    this.showLoader = false;
    this._location.back();
  }

  getVendorInfoForEdit() {
    if (this.vendorId) {
      const vendors = this.vendorsService.getVendors();
      _.forEach(vendors, (vendor) => {
        if (vendor.id === parseInt(this.vendorId)) {
          this.vendorInfo = vendor;
          this.addVendorForm.controls['id'].setValue(vendor.id);
          this.addVendorForm.controls['first_name'].setValue(vendor.first_name);
          this.addVendorForm.controls['last_name'].setValue(vendor.last_name);
          this.addVendorForm.controls['suffix'].setValue(vendor.suffix);
          this.addVendorForm.controls['company'].setValue(vendor.company);
          this.addVendorForm.controls['email'].setValue(vendor.email);
          this.addVendorForm.controls['phone'].setValue(vendor.phoneNumber);
          this.addVendorForm.controls['website'].setValue(vendor.website);
          this.addVendorForm.controls['listingFee'].setValue(vendor.listingFee);
          this.addVendorForm.controls['address'].setValue(vendor.address);
          this.addVendorForm.controls['city'].setValue(vendor.city);
          this.addVendorForm.controls['state'].setValue(vendor.state);
          this.addVendorForm.controls['country'].setValue(vendor.country);
          this.addVendorForm.controls['zip'].setValue(vendor.zip);
          this.addVendorForm.controls['status'].setValue(vendor.status);
        }
      });
    }
  }

  deleteVendor() {
    const activeModal = this.modalService.open(VendorDeletePopupComponent, { size: 'sm' });
    activeModal.componentInstance.modalText = 'vendor';

    activeModal.result.then((status) => {
      if (status) {
        this.deleteLoader = true;
        _.remove(this.vendors, this.vendorInfo);
        this.vendorsService.editVendor(this.vendors);
        this.toastr.success('Sucessfully Deleted!', 'Sucess!');
        this.deleteLoader = false;
        this._location.back();
      }
    });
  }

}
