import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { CookieService } from 'ngx-cookie';
import { CommonAppService } from 'app/services/common.services';

import { environment } from './../../environments';
import { AppState } from 'app/app.service';
import { ResponseHandingService } from 'lrshared_modules/services/response-handling.service';
import * as CryptoJS from "crypto-js";
import * as utf8 from 'utf8';

@Injectable()
export class ProductsService {

    headers = new Headers({
        'headers': '',
        'ModuleId': environment.moduleId,
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

    getProducts() {
        let url = `${environment.merchandiseUrl}Merchandise/Seller/Products`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        //this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    getOpsProducts(role) {
        let url = `${environment.merchandiseUrl}Merchandise/${role}/Products`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        // this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    approveProducts(products, role) {
        const url = `${environment.merchandiseUrl}Merchandise/${role}/Products/Approve`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        // this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('PUT', url, product));
        return this.http.post(url, JSON.stringify(products), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    rejectProducts(products, role) {
        const url = `${environment.merchandiseUrl}Merchandise/${role}/Products/Reject`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        // this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('PUT', url, product));
        return this.http.post(url, JSON.stringify(products), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    addProduct(product) {
        const url = `${environment.merchandiseUrl}Merchandise/Seller/Products`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, product));
        return this.http.post(url, JSON.stringify(product), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }
    updateProduct(product){
        const url = `${environment.merchandiseUrl}Merchandise/Seller/Products`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('PUT', url, product));
        return this.http.put(url, JSON.stringify(product), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }
    getProductById(Id) {
        const url = `${environment.merchandiseUrl}Merchandise/Seller/Products/${Id}`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }
    sendproductForApproval(product) {
        const url = `${environment.merchandiseUrl}Merchandise/Seller/Product/Confirm`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        // this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('PUT', url, product));
        return this.http.put(url, JSON.stringify(product), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    getOpsProductById(productId, role) {
        const url = `${environment.merchandiseUrl}Merchandise/${role}/Products/${productId}`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        // this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('PUT', url, product));
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    editProduct(products) {
        // this.products = products;
        // return this.products;
    }


}