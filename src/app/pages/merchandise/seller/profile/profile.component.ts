import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie';
import * as _ from 'lodash';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { VendorsService } from 'app/services';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    vendorId: any;
    vendorInfo: any;
    bigLoader = false;

    constructor(
        private vendorsService: VendorsService,
        private cookieService: CookieService,
        private _location: Location,
        public toastr: ToastsManager,
    ) { }

    ngOnInit() {
        this.vendorId = this.cookieService.get('sellerId');
        if (this.vendorId) {
            this.getVendorInfoForEdit();
        }
    }

    getVendorInfoForEdit() {
        this.bigLoader = true;
        if (this.vendorId) {
            this.vendorsService.getVendors(this.vendorId).
                then((vendor) => {
                    this.vendorInfo = vendor.Data;
                    console.log("this.vendorInfo ", this.vendorInfo);
                    this.bigLoader = false;
                    if (!this.vendorInfo) {
                        this.vendorInfo = {
                            "SellerCode": "string",
                            "FirstName": "Yogesh",
                            "LastName": "Rathod",
                            "Company": "Company Name",
                            "Address": "101, Chibber Tower",
                            "ZipCode": "400606",
                            "EmailAddress": "email@gmail.com",
                            "ContactNumber": "9920105214",
                            "AltContactNumber": "987643211",
                            "Website": "www.in.com",
                            "ListingFee": "1000",
                            "CreatedOn": '12/12/2017'
                        };
                    }
                }).catch((error) => {
                    console.log("error ", error);
                });
        }
    }



    goBack() {
        this._location.back();
    }

}
