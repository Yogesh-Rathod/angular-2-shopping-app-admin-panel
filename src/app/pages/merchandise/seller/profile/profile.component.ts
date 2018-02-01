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
        console.log("this.vendorId ", this.vendorId);
        if (this.vendorId) {
            this.getVendorInfoForEdit();
        }
    }

    getVendorInfoForEdit() {
        this.bigLoader = true;
        if (this.vendorId) {
            this.vendorsService.getSingleUser(this.vendorId).
                then((vendor) => {
                    this.vendorInfo = vendor.Data;
                    console.log("this.vendorInfo ", this.vendorInfo);
                    this.bigLoader = false;
                    if (!this.vendorInfo) {
                        this.toastr.error('Could not get seller info.', 'Error');
                        this.vendorInfo = {};
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
