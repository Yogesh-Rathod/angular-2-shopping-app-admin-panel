import { Injectable } from '@angular/core';
import { environment } from 'environments';
import { CommonAppService } from 'app/services/common.services';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ResponseHandingService } from 'lrshared_modules/services';

@Injectable()
export class CatalogManagementService {

    constructor(
        private http: Http,
        private responseHandler: ResponseHandingService,
        private commonAppSer: CommonAppService
    ) {
    }

    headers = new Headers({
        'headers': '',
        'ModuleId': environment.moduleId,
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9'
    });
    options = new RequestOptions({ headers: this.headers });

    getCatalogsList() {
        let url = `${environment.merchandiseUrl}Merchandise/Catalog`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    getCatalogsById(_catalogId,_for) {
        let url;
        if(_for == 'approve'){
            url = `${environment.merchandiseUrl}Merchandise/Catalog/Approval/${_catalogId}`;
        }else{
            url = `${environment.merchandiseUrl}Merchandise/Catalog/${_catalogId}`;
        }
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    getCatalogsApprovalList() {
        let url = `${environment.merchandiseUrl}Merchandise/Catalog/Approval`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    addNewCatalogs(_catalog){
        let url = `${environment.merchandiseUrl}Merchandise/Catalog/Approval`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.post(url, _catalog, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }
    approvePostCatalog(_catalog){
        var bodyObj = {
            Id: _catalog.Id,
            Reason: "Will make Dynamic later",
            IsApproved: true
          }
        let url = `${environment.merchandiseUrl}Merchandise/Catalog/Approval/${_catalog.Id}/Approve`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.post(url, bodyObj, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }


    getMapProductList(_catalogId) {
        let url = `${environment.merchandiseUrl}Merchandise/CatalogProductMap/${_catalogId}`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }
}
