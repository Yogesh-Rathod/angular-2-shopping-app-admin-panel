/**
 * @author Shyam Gupta
 * @email shyam.gupta@loylty.in
 * @create date 2017-08-18 05:57:40
 * @modify date 2017-08-18 05:57:40
 * @desc [description]
*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';

import { environment } from 'environments/environment';
import { CommonService } from 'lrshared_modules/services/common-services.service';
import { ResponseHandingService } from 'lrshared_modules/services/response-handling.service';
import * as CryptoJS from "crypto-js";
import * as utf8 from 'utf8';

@Injectable()
export class LoginService {

    headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9'
    });
    options = new RequestOptions({ headers: this.headers });

    constructor(
        private http: Http,
        private commSer: CommonService,
        private responseHandler: ResponseHandingService
    ) {

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

    userLogin(data): Promise<any> {
        const url = `${environment.rbacUrl}Auth/Login`;
        this.headers.set('LRSignAuth', this.createHMACSignature('POST', url, data));
        return this.http.post(url, JSON.stringify(data), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    userResetPassword(username): Promise<any> {
        const url = `${environment.rbacUrl}/user/${username}/resetPassword`;
        // const options = new RequestOptions({ headers: this.headers });
        return this.http.post(url, {}, this.options)
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    handleError(error: any): Promise<any> {
        let rejParse;
        try {
            rejParse = JSON.parse(error._body);
        } catch (ex) {
            rejParse = {
                message: 'Something went wrong.',
                status: 0
            };
            console.log(ex);
        }

        try {
            return Promise.reject(rejParse || error);
        } catch (ex) {
            return Promise.reject(error);
        }
    }

    handleResponse(response: any): Promise<any> {
        const emptyArr: any = [];
        console.log("response ", response);
        if (response.status >= 200 || response.status < 204) {
            return response.json();
        } else if (response.status === 204) {
            return emptyArr;
        }
    }
}
