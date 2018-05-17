/**
 * @author Arti Kumari
 * @email arti.kumari@loylty.in
 * @create date 2017-09-07
 * @modify date 2017-09-07
 * @desc [description]
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from 'environments/environment';
import { AppState } from 'app/app.service';
import { CookieService } from 'ngx-cookie';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { CommonAppService } from 'app/services/common.services';
import { ResponseHandingService } from 'users_modules/services/response-handling.service';

@Injectable()
export class UserService {
    constructor(
        private cookieService: CookieService,
        private http: Http,
        private commonAppSer: CommonAppService,
        private responseHandler: ResponseHandingService
    ) {}

    headers = new Headers({
        headers: '',
        'Content-Type': 'application/json',
        Accept: 'q=0.8;application/json;q=0.9'
    });
    options = new RequestOptions({ headers: this.headers });

    getAllUsers() {
        let url = `${environment.rbacUrl}Profile/All`;
        this.headers.set(
            'Authorization',
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set(
            'LRSignAuth',
            this.commonAppSer.createHMACSignature('GET', url)
        );
        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    addUser(data): Promise<any> {
        const url = `${environment.rbacUrl}Profile`;
        this.headers.set(
            'Authorization',
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set(
            'LRSignAuth',
            this.commonAppSer.createHMACSignature('POST', url, data)
        );
        return this.http
            .post(url, JSON.stringify(data), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    fetchSingleUser(id?: String): Promise<any> {
        let url = id
            ? `${environment.rbacUrl}Profile/${id}`
            : `${environment.rbacUrl}Profile`;
        this.headers.set(
            'Authorization',
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set(
            'LRSignAuth',
            this.commonAppSer.createHMACSignature('GET', url)
        );

        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    updateUser(data): Promise<any> {
        const url = `${environment.rbacUrl}Profile`;
        this.headers.set(
            'Authorization',
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set(
            'LRSignAuth',
            this.commonAppSer.createHMACSignature('PUT', url, data)
        );
        return this.http
            .put(url, JSON.stringify(data), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    changePassword(data): Promise<any> {
        const url = `${environment.rbacUrl}Profile/ChangePassword`;
        this.headers.set(
            'Authorization',
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set(
            'LRSignAuth',
            this.commonAppSer.createHMACSignature('PUT', url, data)
        );
        return this.http
            .put(url, JSON.stringify(data), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }

    fetchRoles() {
        const url = `${environment.rbacUrl}Role/All`;
        this.headers.set(
            'Authorization',
            this.commonAppSer.crateAuthorization()
        );
        this.headers.set(
            'LRSignAuth',
            this.commonAppSer.createHMACSignature('GET', url)
        );
        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch(err => this.responseHandler.handleError(err));
    }
}
