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
export class MerchandiseService {

    headers = new Headers({
        'headers': '',
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9'
    });
    options = new RequestOptions({ headers: this.headers });

    // All Operations Related To Categories

    constructor(
        private cookieService: CookieService,
        private http: Http,
        private global: AppState,
        private responseHandler: ResponseHandingService,
        private commonAppSer: CommonAppService) {
    }

    getCategories(categoryId?) {
        let url = categoryId ? `${environment.merchandiseUrl}Merchandise/Category/${categoryId}` : `${environment.merchandiseUrl}Merchandise/Category`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    getCategoriesByLevel(level) {
        let url = `${environment.merchandiseUrl}Merchandise/CategoriesByLevel/${level}`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    getUnApprovedCategories() {
        let url = `${environment.merchandiseUrl}Merchandise/CategoriesForApproval`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    addCategory(categoryInfo) {
        const url = `${environment.merchandiseUrl}Merchandise/AddToApprovalCategory`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, categoryInfo));
        return this.http.post(url, JSON.stringify(categoryInfo), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    approveCategory(categoryInfo) {
        const url = `${environment.merchandiseUrl}Merchandise/ApproveCategory`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, categoryInfo));
        return this.http.post(url, JSON.stringify(categoryInfo), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    editCategories(categories) {
        // this.categories = categories;
        // return this.categories;
    }

}
