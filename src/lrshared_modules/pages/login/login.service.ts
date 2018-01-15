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
import { CommonAppService } from 'app/services/common.services';
import { ResponseHandingService } from 'lrshared_modules/services/response-handling.service';

@Injectable()
export class LoginService {

    headers = new Headers({
        'headers': '',
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9'
    });
    options = new RequestOptions({ headers: this.headers });

    constructor(
        private http: Http,
        private commonAppSer: CommonAppService,
        private commSer: CommonService,
        private responseHandler: ResponseHandingService
    ) {

    }

    userLogin(data): Promise<any> {
        const url = `${environment.rbacUrl}Auth/Login`;
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, data));
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
        console.log("Login handleError ", error);
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
        if (response.status >= 200 || response.status < 204) {
            return response.json();
        } else if (response.status === 204) {
            return emptyArr;
        }
    }
}
