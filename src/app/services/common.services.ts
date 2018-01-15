import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from './../../environments';
import { AppState } from 'app/app.service';
import { CookieService } from 'ngx-cookie';
import * as CryptoJS from "crypto-js";
import * as utf8 from 'utf8';


@Injectable()
export class CommonAppService {


    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        private http: Http,
        private global: AppState,
        private cookieService: CookieService

    ) {

    }

    handleError(error: any): Promise<any> {
        return Promise.reject(JSON.parse(error._body) || error);
    }

    handleResponse(response: any): Promise<any> {
        const emptyArr: any = [];
        if (response.status >= 200 && response.status < 204) {
            return response.json();
        } else if (response.status === 204) {
            return emptyArr;
        }
    }

    getUserData() {
        return JSON.parse(this.global.get('userData'));
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
        return `${environment.hmacCliendId}:${finalSignature}:${nounce}:${timestamp}`;
    }
}
