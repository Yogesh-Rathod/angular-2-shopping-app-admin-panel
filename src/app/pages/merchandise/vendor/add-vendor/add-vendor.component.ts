import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

import { VendorsService } from 'app/services';
import { RegEx } from './../../../regular-expressions';

@Component({
    selector: 'app-add-vendor',
    templateUrl: './add-vendor.component.html',
    styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {

    vendorId: any;
    addVendorForm: FormGroup;
    showLoader = false;
    bigLoader = false;
    vendors: any;
    vendorInfo: any;
    citiesList: any;
    usersList: any;
    usersName: any;
    usersDropdownSettings = {
        singleSelection: false,
        text: "Select Users",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true
    };

    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
        private _location: Location,
        private vendorsService: VendorsService,
        private toastr: ToastsManager,
        private route: ActivatedRoute,
        private router: Router,
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
        this.getCities();
        this.getUsersList();
        if (this.vendorId) {
            this.getVendorInfoForEdit();
        }
    }

    createForm() {
        this.addVendorForm = this.fb.group({
            'SellerId': [''],
            'FirstName': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(20)
                ])
            ],
            'LastName': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(20)
                ])
            ],
            "SellerCode": [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(20)
                ])
            ],
            "Company": [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            'EmailAddress': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(RegEx.Email)
                ])
            ],
            "ContactNumber": [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(RegEx.phoneNumber)
                ])
            ],
            "AltContactNumber": [
                '',
                Validators.compose([
                    Validators.pattern(RegEx.phoneNumber)
                ])
            ],
            "Website": [
                '',
                Validators.compose([
                    Validators.pattern(RegEx.websiteUrl)
                ])
            ],
            "ListingFee": [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(RegEx.onlyNumber)
                ])
            ],
            "Address": [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            "CityId": [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            // "GstIn": [
            //     '',
            //     Validators.compose([
            //         Validators.required,
            //         Validators.pattern(RegEx.gstIn)
            //     ])
            // ],
            "ZipCode": [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(RegEx.zipCode)
                ])
            ],
            'IsActive': [
                'TRUE',
                Validators.compose([
                    Validators.required
                ])
            ],
            'UserId': [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            'CreatedBy': ['Yogesh']
        });
    }

    getUsersList() {
        this.vendorsService.getUsers().
            then((user) => {
                this.usersList = user.Data;
                this.usersList = this.usersList.map((item) => {
                    item.id = item.Id;
                    item.itemName = item.UserName;
                    return item;
                });
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    getCities() {
        // this.bigLoader = true;
        this.vendorsService.getCities().
            then((cities) => {
                this.citiesList = cities.Data;
                this.bigLoader = false;
                this.citiesList = this.citiesList.sort(this.sortCities);
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    sortCities(a, b) {
        const genreA = a.Name.toUpperCase();
        const genreB = b.Name.toUpperCase();
        let comparison = 0;
        if (genreA > genreB) {
            comparison = 1;
        } else if (genreA < genreB) {
            comparison = -1;
        }
        return comparison;
    }

    validatenumber(e) {
        if (!RegEx.Numbers.test(`${e.key}`) && `${e.key}`.length === 1) {
            e.preventDefault();
        }
    }

    addVendor(addVendorForm) {
        this.showLoader = true;
        if (addVendorForm.SellerId) {
            this.vendorsService.updateVendor(addVendorForm)
                .then((success) => {
                    console.log("success ", success);
                    if (success.Code === 200) {
                        this.toastr.success('Sucessfully Updated Seller Info!', 'Sucess!');
                        this.showLoader = false;
                        this._location.back();
                    } else if (success.Code === 500) {
                        this.toastr.error('Could not update seller!', 'Error!');
                        this.showLoader = false;
                    }
                }).catch((error) => {
                    console.log("error ", error);
                })
        } else {
            delete addVendorForm.SellerId;
            this.vendorsService.addVendor(addVendorForm)
                .then((success) => {
                    console.log("success ", success);
                    if (success.Code === 200) {
                        this.toastr.success('Sucessfully Added Seller Info!', 'Sucess!');
                        this.showLoader = false;
                        this._location.back();
                    } else if (success.Code === 500) {
                        this.toastr.error('Could not add seller!', 'Error!');
                        this.showLoader = false;
                    }
                }).catch((error) => {
                    console.log("error ", error);
                });
        }
    }

    getVendorInfoForEdit() {
        this.bigLoader = true;
        if (this.vendorId) {
            this.vendorsService.getVendors(this.vendorId).
                then((vendor) => {
                    this.vendorInfo = vendor.Data;
                    console.log("this.vendorInfo ", this.vendorInfo);
                    this.addVendorForm.controls['SellerId'].setValue(this.vendorInfo.SellerId);
                    this.addVendorForm.controls['UserId'].setValue(this.vendorInfo.UserId);
                    this.usersName = this.vendorInfo.UserId;
                    this.addVendorForm.controls['FirstName'].setValue(this.vendorInfo.FirstName);
                    this.addVendorForm.controls['LastName'].setValue(this.vendorInfo.LastName);
                    this.addVendorForm.controls['SellerCode'].setValue(this.vendorInfo.SellerCode);
                    this.addVendorForm.controls['Company'].setValue(this.vendorInfo.Company);
                    this.addVendorForm.controls['EmailAddress'].setValue(this.vendorInfo.EmailAddress);
                    this.addVendorForm.controls['ContactNumber'].setValue(this.vendorInfo.ContactNumber);
                    this.addVendorForm.controls['AltContactNumber'].setValue(this.vendorInfo.AltContactNumber);
                    this.addVendorForm.controls['Website'].setValue(this.vendorInfo.Website);
                    this.addVendorForm.controls['ListingFee'].setValue(this.vendorInfo.ListingFee);
                    // this.addVendorForm.controls['GstIn'].setValue(this.vendorInfo.GstIn);
                    this.addVendorForm.controls['Address'].setValue(this.vendorInfo.Address);
                    this.addVendorForm.controls['CityId'].setValue(this.vendorInfo.CityId);
                    this.addVendorForm.controls['ZipCode'].setValue(this.vendorInfo.ZipCode);
                    this.addVendorForm.controls['IsActive'].setValue(this.vendorInfo.IsActive);
                    this.checkFormValidation();
                    this.bigLoader = false;
                }).catch((error) => {
                    console.log("error ", error);
                });
        }
    }

    checkFormValidation() {
        for (var i in this.addVendorForm.controls) {
            this.addVendorForm.controls[i].markAsTouched();
        }
    }

}
