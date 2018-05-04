import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers, ResponseContentType } from '@angular/http';
import { ResponseHandingService } from 'users_modules/services';
import { CommonAppService } from 'app/services/common.services';
import { environment } from 'environments';
import * as FileSaver from 'file-saver';

@Injectable()
export class OrdersService {

    constructor(
        private http: Http,
        private responseHandler: ResponseHandingService,
        private commonAppSer: CommonAppService
    ) {
    }

    headers = new Headers({
        'headers': '',
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9'
    });
    options = new RequestOptions({ headers: this.headers });


    getOrdersByPONumber(poNumber?, queryParams?, pageSize : any = 150) {
        let url = poNumber ? `${environment.merchandiseUrl}Orders/${poNumber}?e.pageSize=${pageSize}` : `${environment.merchandiseUrl}Orders?e.pageSize=${pageSize}`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        if (queryParams) {
            url = `${url}&${queryParams}`
        }
        return this.http.get(url, this.options)
            .toPromise()
            .then( this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    cancelOrder(data) {
        let url = `${environment.merchandiseUrl}Orders/Cancel`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, data));
        return this.http.post(url, JSON.stringify(data), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    markOrderRTO(data) {
        let url = `${environment.merchandiseUrl}Orders/RTO`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, data));
        return this.http.post(url, JSON.stringify(data), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    getReports(data) {
        let url = `${environment.merchandiseUrl}Orders/SLA`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, data));
        return this.http.post(url, JSON.stringify(data), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    sendToProcessed(orders) {
        let url = `${environment.merchandiseUrl}Orders/Processed`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('PUT', url, orders));
        return this.http.put(url, JSON.stringify(orders), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    sendToDispatched(orders) {
        let url = `${environment.merchandiseUrl}Orders/Dispatch`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('PUT', url, orders));
        return this.http.put(url, JSON.stringify(orders), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    sendToDelivered(orders) {
        let url = `${environment.merchandiseUrl}Orders/Delivery`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('PUT', url, orders));
        return this.http.put(url, JSON.stringify(orders), this.options)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    downloadPOPdf(data, queryParams?) {
        let url = `${environment.merchandiseUrl}Orders/Download/pdf?e.pageSize`;
        if (queryParams) {
            url = `${url}&${queryParams}`
        }
        this.options = new RequestOptions({
            headers: this.headers,
            responseType: ResponseContentType.Blob
        });
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, data));
        return this.http.post(url, JSON.stringify(data), this.options)
        .toPromise()
        .then((response) => {
            FileSaver.saveAs(response.blob(), 'PurchaseOrders.zip');
            this.options = new RequestOptions({
                headers: this.headers,
                responseType: null
            });
        });
    }


}