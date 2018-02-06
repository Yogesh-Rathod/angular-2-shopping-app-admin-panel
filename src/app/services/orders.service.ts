import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { ResponseHandingService } from 'users_modules/services';
import { CommonAppService } from 'app/services/common.services';
import { environment } from 'environments';

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

    ordersInfo = [
        {
            id: 12333,
            no: 1,
            orderStatus: 'Processing',
            paymentStatus: 'Refunded',
            shippingStatus: 'Delivered',
            guid: 'db8db6cd-894d-4423-9c09-a948c728a2bc',
            customerInfo: {
                name: 'Victoria Terces',
                email: 'victoria_victoria@nopCommerce.com',
                ipAddress: '127.0.0.1',
                phone: 8286875250,
                fax: '',
                company: 'Brenda Company',
                address1: '1249 Tongass Avenue, Suite B',
                address2: '',
                city: 'Ketchikan',
                stateProvince: 'Alaska',
                zip: 99901,
                country: 'United States of America'
            },
            productsInfo: [
                {
                    picture: 'assets/images/products/home-office-336373_640.jpg',
                    name: 'Pride and Prejudice',
                    sku: 'PRIDE_PRJ',
                    price: 13000,
                    quantity: 1,
                    discount: 1000,
                    total: 12000
                },
                {
                    picture: 'assets/images/products/laptop-154091_640.png',
                    name: 'First Prize Pies',
                    sku: 'FIRST_PRP',
                    price: 1000,
                    quantity: 1,
                    discount: 500,
                    total: 500
                }
            ],
            store: 'store 1',
            subtotal: 11000,
            shipping: 500,
            createdOn: 1507725627158,
            orderTotal: 12000,
            paymentMethod: 'Check / Money Order',
        },
        {
            id: 12334,
            no: 2,
            orderStatus: 'Pending',
            paymentStatus: 'Paid',
            shippingStatus: 'Shipping not required',
            customerInfo: {
                name: 'James Pan',
                email: 'james_pan@nopCommerce.com',
                phone: 8286875250,
                fax: '',
                company: 'James Pan',
                address1: '1249 Tongass Avenue, Suite B',
                address2: '',
                city: 'Mumbai',
                stateProvince: 'Maharashtra',
                zip: 400001,
                country: 'India'
            },
            productsInfo: [],
            store: 'store 2',
            createdOn: 751141800000,
            orderTotal: 13000,
            paymentMethod: 'Credit Card'
        },
        {
            id: 12333,
            no: 1,
            orderStatus: 'Delivered',
            paymentStatus: 'Refunded',
            shippingStatus: 'Delivered',
            guid: 'db8db6cd-894d-4423-9c09-a948c728a2bc',
            customerInfo: {
                name: 'Victoria Terces',
                email: 'victoria_victoria@nopCommerce.com',
                ipAddress: '127.0.0.1',
                phone: 8286875250,
                fax: '',
                company: 'Brenda Company',
                address1: '1249 Tongass Avenue, Suite B',
                address2: '',
                city: 'Ketchikan',
                stateProvince: 'Alaska',
                zip: 99901,
                country: 'United States of America'
            },
            productsInfo: [
                {
                    picture: 'assets/images/products/home-office-336373_640.jpg',
                    name: 'Pride and Prejudice',
                    sku: 'PRIDE_PRJ',
                    price: 13000,
                    quantity: 1,
                    discount: 1000,
                    total: 12000
                },
                {
                    picture: 'assets/images/products/laptop-154091_640.png',
                    name: 'First Prize Pies',
                    sku: 'FIRST_PRP',
                    price: 1000,
                    quantity: 1,
                    discount: 500,
                    total: 500
                }
            ],
            store: 'store 1',
            subtotal: 11000,
            shipping: 500,
            createdOn: 1507725627158,
            orderTotal: 12000,
            paymentMethod: 'Check / Money Order',
        },
    ];


    getOrdersByPONumber(poNumber?, queryParams?) {
        let url = poNumber ? `${environment.merchandiseUrl}Orders/${poNumber}?e.pageSize=150` : `${environment.merchandiseUrl}Orders?e.pageSize=150`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        if (queryParams) {
            url = `${url}&${queryParams}`
        }
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then( this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    getOrders() {
        return this.ordersInfo;
    }

    cancelOrder(data) {
        let url = `${environment.merchandiseUrl}Orders/Cancel`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.post(url, JSON.stringify(data), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(
            this.responseHandler.handleResponse
            )
            .catch((err) => this.responseHandler.handleError(err));
    }

    markOrderRTO(data) {
        let url = `${environment.merchandiseUrl}Orders/RTO`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.post(url, JSON.stringify(data), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(
            this.responseHandler.handleResponse
            )
            .catch((err) => this.responseHandler.handleError(err));
    }

    editOrder(orders) {
        this.ordersInfo = orders;
        return this.ordersInfo;
    }

    getReports(data) {
        let url = `${environment.merchandiseUrl}Orders/SLA`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.post(url, JSON.stringify(data), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(
            this.responseHandler.handleResponse
            )
            .catch((err) => this.responseHandler.handleError(err));
    }

    sendToProcessed(orders) {
        let url = `${environment.merchandiseUrl}Orders/Processed`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.put(url, JSON.stringify(orders), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(
            this.responseHandler.handleResponse
            )
            .catch((err) => this.responseHandler.handleError(err));
    }

    sendToDispatched(orders) {
        let url = `${environment.merchandiseUrl}Orders/Dispatch`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.put(url, JSON.stringify(orders), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(
            this.responseHandler.handleResponse
            )
            .catch((err) => this.responseHandler.handleError(err));
    }

    sendToDelivered(orders) {
        let url = `${environment.merchandiseUrl}Orders/Delivery`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.put(url, JSON.stringify(orders), this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(
            this.responseHandler.handleResponse
            )
            .catch((err) => this.responseHandler.handleError(err));
    }


}