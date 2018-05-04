import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { CookieService } from "ngx-cookie";
import { CommonAppService } from "app/services/common.services";

import { environment } from "./../../environments";
import { AppState } from "app/app.service";
import { ResponseHandingService } from "users_modules/services/response-handling.service";
import * as CryptoJS from "crypto-js";
import * as utf8 from "utf8";
import * as _ from 'lodash';

@Injectable()
export class ProductsService {

    headers = new Headers({
        headers: "",
        "Content-Type": "application/json",
        Accept: "q=0.8;application/json;q=0.9"
    });
    options = new RequestOptions({ headers: this.headers });

    constructor(
        private cookieService: CookieService,
        private http: Http,
        private global: AppState,
        private responseHandler: ResponseHandingService,
        private commonAppSer: CommonAppService
    ) { }

    getProducts(queryParams?, pageIndex?, pageSize?) {
        let url = `${environment.merchandiseUrl}Merchandise/Seller/Products?e.pageIndex=${pageIndex}&e.pageSize=${pageSize}`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        if (queryParams) {
            url = `${url}&${queryParams}`
        }
        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    getProductsForExport(queryParams?, pageIndex?, pageSize?) {
        let url = `${environment.merchandiseUrl}Merchandise/Seller/Products/Export?e.pageIndex=${pageIndex}&e.pageSize=${pageSize}`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        if (queryParams) {
            url = `${url}&${queryParams}`
        }
        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    getOpsProducts(role, queryParams?, pageIndex?, pageSize?) {
        let url = `${environment.merchandiseUrl}Merchandise/${role}/Products?e.pageIndex=${pageIndex}&e.pageSize=${pageSize}`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        if (queryParams) {
            url = `${url}&${queryParams}`
        }
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    approveProducts(products, role, searchForm?) {
        const url = `${
            environment.merchandiseUrl
            }Merchandise/${role}/Products/Approve?e.pageIndex=&${searchForm}`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, products));
        return this.http
            .post(url, JSON.stringify(products), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    rejectProducts(products, role, searchForm?) {
        const url = `${
            environment.merchandiseUrl
            }Merchandise/${role}/Products/Reject?e.pageIndex=&${searchForm}`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, products));
        return this.http
            .post(url, JSON.stringify(products), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    toggleProductsOutofStock(products, status, searchForm?) {
        let url = `${
            environment.merchandiseUrl
            }Merchandise/Seller/Products/OutOfStock/${status}?e.pageIndex=`;
        if (!_.isEmpty(searchForm)) {
            url = `${
                environment.merchandiseUrl
            }Merchandise/Seller/Products/OutOfStock/${status}?e.pageIndex=&${searchForm}`;
        }

        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, products));
        return this.http
            .post(url, JSON.stringify(products), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    addProduct(product) {
        const url = `${environment.merchandiseUrl}Merchandise/Seller/Products`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set(
            "LRSignAuth",
            this.commonAppSer.createHMACSignature("POST", url, product)
        );
        return this.http
            .post(url, JSON.stringify(product), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    updateProduct(product) {
        const url = `${environment.merchandiseUrl}Merchandise/Seller/Products`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set(
            "LRSignAuth",
            this.commonAppSer.createHMACSignature("PUT", url, product)
        );
        return this.http
            .put(url, JSON.stringify(product), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    getProductById(Id) {
        const url = `${
            environment.merchandiseUrl
            }Merchandise/Seller/Products/${Id}`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set(
            "LRSignAuth",
            this.commonAppSer.createHMACSignature("GET", url)
        );
        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    sendproductForApproval(product, searchForm?) {
        const url = `${
            environment.merchandiseUrl
            }Merchandise/Seller/Products/Confirm?e.pageIndex=&${searchForm}`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, product));
        return this.http
            .post(url, JSON.stringify(product), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    getOpsProductById(productId, role) {
        const url = `${
            environment.merchandiseUrl
            }Merchandise/${role}/Products/${productId}`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    confirmOperationProduct(product, role) {
        const url = `${
            environment.merchandiseUrl
            }Merchandise/${role}/Products/Confirm`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, product));
        return this.http
            .post(url, JSON.stringify(product), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    editOperationProduct(data, role) {
        const url = `${environment.merchandiseUrl}Merchandise/${role}/Products`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('PUT', url, data));
        return this.http
            .put(url, data, this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    getMasterProducts(filterData) {
        const url = `${
            environment.merchandiseUrl
            }Merchandise/Products?${filterData}`;
        this.headers.set(
            "Authorization",
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }
}
