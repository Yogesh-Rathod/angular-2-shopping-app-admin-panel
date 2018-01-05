import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { CookieService } from 'ngx-cookie';

import { environment } from './../../environments';
import { AppState } from 'app/app.service';
import { ResponseHandingService } from 'lrshared_modules/services/response-handling.service';
import * as CryptoJS from "crypto-js";
import * as utf8 from 'utf8';

@Injectable()
export class MerchandiseService {

  headers = new Headers({
    'headers': '',
    'ModuleId': environment.moduleId,
    'Content-Type': 'application/json',
    'Accept': 'q=0.8;application/json;q=0.9'
  });
  options = new RequestOptions({ headers: this.headers });

  // All Operations Related To Categories

  constructor(
    private cookieService: CookieService,
    private http: Http,
    private global: AppState,
    private responseHandler: ResponseHandingService) {
  }

  crateAuthorization() {
    const token = JSON.parse(this.cookieService.get('MERCHANDISE.token'));
    if (token) {
      return `Bearer ${token.accessToken}`;
    } else {
      return 'Bearer ';
    }
  }


  createHMACSignature(requestMethod, requestURL, body = '') {
    let requestUrl = encodeURIComponent(requestURL).toLowerCase(),
      timestamp = + new Date(),
      nounce = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(8)),
      signatureRaw = `${environment.hmacCliendId}${requestMethod}${requestUrl}${timestamp}${nounce}`;

    if (body) {
      const contentString = JSON.stringify(body),
        updatedContent = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(utf8.encode(contentString)));
      signatureRaw = signatureRaw + updatedContent;
    }
    // Secret Will Be Updated Later On
    const clientSecret = utf8.encode(environment.hmacClientSecret);
    const finalSignature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(utf8.encode(signatureRaw), clientSecret));

    console.log("finalSignature ", `lvbportal:${finalSignature}:${nounce}:${timestamp}`);
    return `${environment.hmacCliendId}:${finalSignature}:${nounce}:${timestamp}`;
  }

  getCategories() {
    let url = `${environment.merchandiseUrl}Merchandise/Category`;
    this.headers.set('Authorization', this.crateAuthorization());
    // this.headers.set('LRSignAuth', this.createHMACSignature('GET', url));
    return this.http.get(url, this.options)
      .timeout(environment.timeOut)
      .toPromise()
      .then(this.responseHandler.handleResponse)
      .catch((err) => this.responseHandler.handleError(err));
  }

  getUnApprovedCategories() {
    let url = `${environment.merchandiseUrl}Merchandise/CategoriesForApproval`;
    this.headers.set('Authorization', this.crateAuthorization());
    // this.headers.set('LRSignAuth', this.createHMACSignature('GET', url));
    return this.http.get(url, this.options)
      .timeout(environment.timeOut)
      .toPromise()
      .then(this.responseHandler.handleResponse)
      .catch((err) => this.responseHandler.handleError(err));
  }

  addCategory(categoryInfo) {
    const url = `${environment.merchandiseUrl}Merchandise/AddToApprovalCategory`;
    this.headers.set('Authorization', this.crateAuthorization());
    // this.headers.set('LRSignAuth', this.createHMACSignature('POST', url, categoryInfo));
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
