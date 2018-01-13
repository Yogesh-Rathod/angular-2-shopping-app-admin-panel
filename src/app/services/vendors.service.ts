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

    getVendors() {
        let url = `${environment.sellerApiUrl}Seller`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        //this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    addVendor(vendor) {
        // this.vendors.push(vendor);
        // return this.vendors;
    }

    editVendor(vendors) {
        // this.vendors = vendors;
        // return this.vendors;
    }

}