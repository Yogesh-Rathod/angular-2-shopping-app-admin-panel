import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { CookieService } from 'ngx-cookie';
import { CommonAppService } from 'app/services/common.services';

import { environment } from './../../environments';
import { AppState } from 'app/app.service';
import { ResponseHandingService } from 'lrshared_modules/services/response-handling.service';

@Injectable()
export class VendorsService {

    headers = new Headers({
        'headers': '',
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9'
    });
    options = new RequestOptions({ headers: this.headers });

    constructor(
        private cookieService: CookieService,
        private http: Http,
        private global: AppState,
        private responseHandler: ResponseHandingService,
        private commonAppSer: CommonAppService) {
    }

    getVendors(sellerId?) {
        let url = sellerId ? `${environment.merchandiseUrl}Seller/${sellerId}` : `${environment.merchandiseUrl}Seller`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        //this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    getCities() {
        let url = `${environment.citiesAPIUrl}`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    getUsers() {
        let url = `${environment.merchandiseUrl}Seller/User`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        // this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    getSingleUser(userId) {
        let url = `${environment.merchandiseUrl}Seller/User/${userId}`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        // this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    addVendor(vendor) {
        let url = `${environment.merchandiseUrl}Seller`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        //this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.post(url, JSON.stringify(vendor), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    updateVendor(vendor) {
        let url = `${environment.merchandiseUrl}Seller`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        //this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.put(url, JSON.stringify(vendor), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    editVendor(vendors) {
        // this.vendors = vendors;
        // return this.vendors;
    }

}