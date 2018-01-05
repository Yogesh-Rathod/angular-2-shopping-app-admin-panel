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

    banksInfo = [
        {
            id: 12233,
            name: 'Catalog 1',
            status: true,
            createdOn: '1510296629648',
            vendorCount: 3,
            productsCount: 3,
            purchasesCount: 222,
            type: 'common',
            productsInfo: [
                {
                    id: 12345,
                    picture: 'assets/images/products/home-office-336373_640.jpg',
                    name: 'Pride and Prejudice',
                    sku: 'PRIDE_PRJ',
                    price: 14000,
                    quantity: 1,
                    discount: 1000,
                    total: 13000,
                    status: 'Active'
                },
                {
                    id: 12346,
                    picture: 'assets/images/products/laptop-154091_640.png',
                    name: 'First Prize Pies',
                    sku: 'FIRST_PRP',
                    price: 1000,
                    quantity: 1,
                    discount: 500,
                    total: 500,
                    status: 'Inactive'
                },
                {
                    id: 12347,
                    picture: 'assets/images/products/laptop-images.jpeg',
                    name: 'HP 15 Core i3',
                    sku: 'HP_15_Core_i3',
                    price: 32990,
                    quantity: 3,
                    discount: 990,
                    total: 32000,
                    status: 'Active'
                }
            ],
            vendors: [
                {
                    'id': 1,
                    'first_name': 'Verla',
                    'last_name': 'Spong',
                    'email': 'test@test.com',
                    'status': true,
                    'suffix': 'VS',
                    'company': 'HDFC',
                    'phoneNumber': '1234567890',
                    'website': 'https://www.india.com',
                    'address': '101, Ruby Tower, dadar.',
                    'city': 'Mumbai',
                    'state': 'Maharashtra',
                    'country': 'India',
                    'zip': '400606'
                },
                {
                    'id': 2,
                    'first_name': 'Jade',
                    'last_name': 'O Sharkey',
                    'email': 'Jade.Sharkey@gmail.com',
                    'status': false,
                    'suffix': 'JO',
                    'company': 'JIO',
                    'phoneNumber': '9387654321',
                    'website': 'https://www.JIO.com',
                    'address': '101, Ruby Tower, dadar.',
                    'city': 'Mumbai',
                    'state': 'Maharashtra',
                    'country': 'India',
                    'zip': '400606'
                },
                {
                    'id': 3,
                    'first_name': 'Vernice',
                    'last_name': 'Cicconettii',
                    'email': 'Vernice.Cicconettii@gmail.com',
                    'status': true,
                    'suffix': 'VC',
                    'company': 'Reliance',
                    'phoneNumber': '9387654321',
                    'website': 'https://www.Reliance.com',
                    'address': '101, Ruby Tower, dadar.',
                    'city': 'Mumbai',
                    'state': 'Maharashtra',
                    'country': 'India',
                    'zip': '400606'
                }
            ]
        },
        {
            id: 12235,
            name: 'Catalog 2',
            status: true,
            createdOn: '1451586600000',
            vendorCount: 3,
            productsCount: 3,
            type: 'common',
            purchasesCount: 222,
            productsInfo: [
                {
                    id: 12345,
                    picture: 'assets/images/products/home-office-336373_640.jpg',
                    name: 'Pride and Prejudice',
                    sku: 'PRIDE_PRJ',
                    price: 14000,
                    quantity: 1,
                    discount: 1000,
                    total: 13000,
                    status: 'Active'
                },
                {
                    id: 12346,
                    picture: 'assets/images/products/laptop-154091_640.png',
                    name: 'First Prize Pies',
                    sku: 'FIRST_PRP',
                    price: 1000,
                    quantity: 1,
                    discount: 500,
                    total: 500,
                    status: 'Inactive'
                },
                {
                    id: 12347,
                    picture: 'assets/images/products/laptop-images.jpeg',
                    name: 'HP 15 Core i3',
                    sku: 'HP_15_Core_i3',
                    price: 32990,
                    quantity: 3,
                    discount: 990,
                    total: 32000,
                    status: 'Active'
                }
            ],
            vendors: [
                {
                    'id': 1,
                    'first_name': 'Verla',
                    'last_name': 'Spong',
                    'email': 'test@test.com',
                    'status': true,
                    'suffix': 'VS',
                    'company': 'HDFC',
                    'phoneNumber': '1234567890',
                    'website': 'https://www.india.com',
                    'address': '101, Ruby Tower, dadar.',
                    'city': 'Mumbai',
                    'state': 'Maharashtra',
                    'country': 'India',
                    'zip': '400606'
                },
                {
                    'id': 2,
                    'first_name': 'Jade',
                    'last_name': 'O Sharkey',
                    'email': 'Jade.Sharkey@gmail.com',
                    'status': false,
                    'suffix': 'JO',
                    'company': 'JIO',
                    'phoneNumber': '9387654321',
                    'website': 'https://www.JIO.com',
                    'address': '101, Ruby Tower, dadar.',
                    'city': 'Mumbai',
                    'state': 'Maharashtra',
                    'country': 'India',
                    'zip': '400606'
                },
                {
                    'id': 3,
                    'first_name': 'Vernice',
                    'last_name': 'Cicconettii',
                    'email': 'Vernice.Cicconettii@gmail.com',
                    'status': true,
                    'suffix': 'VC',
                    'company': 'Reliance',
                    'phoneNumber': '9387654321',
                    'website': 'https://www.Reliance.com',
                    'address': '101, Ruby Tower, dadar.',
                    'city': 'Mumbai',
                    'state': 'Maharashtra',
                    'country': 'India',
                    'zip': '400606'
                }
            ]
        },
        {
            id: 12234,
            name: 'Catalog 3',
            status: true,
            createdOn: '1467829800000',
            vendorCount: 3,
            productsCount: 3,
            type: 'unique',
            purchasesCount: 222,
            productsInfo: [
                {
                    id: 12345,
                    picture: 'assets/images/products/home-office-336373_640.jpg',
                    name: 'Pride and Prejudice',
                    sku: 'PRIDE_PRJ',
                    price: 14000,
                    quantity: 1,
                    discount: 1000,
                    total: 13000,
                    status: 'Active'
                },
                {
                    id: 12346,
                    picture: 'assets/images/products/laptop-154091_640.png',
                    name: 'First Prize Pies',
                    sku: 'FIRST_PRP',
                    price: 1000,
                    quantity: 1,
                    discount: 500,
                    total: 500,
                    status: 'Inactive'
                },
                {
                    id: 12347,
                    picture: 'assets/images/products/laptop-images.jpeg',
                    name: 'HP 15 Core i3',
                    sku: 'HP_15_Core_i3',
                    price: 32990,
                    quantity: 3,
                    discount: 990,
                    total: 32000,
                    status: 'Active'
                }
            ],
            vendors: [
                {
                    'id': 1,
                    'first_name': 'Verla',
                    'last_name': 'Spong',
                    'email': 'test@test.com',
                    'status': true,
                    'suffix': 'VS',
                    'company': 'HDFC',
                    'phoneNumber': '1234567890',
                    'website': 'https://www.india.com',
                    'address': '101, Ruby Tower, dadar.',
                    'city': 'Mumbai',
                    'state': 'Maharashtra',
                    'country': 'India',
                    'zip': '400606'
                },
                {
                    'id': 2,
                    'first_name': 'Jade',
                    'last_name': 'O Sharkey',
                    'email': 'Jade.Sharkey@gmail.com',
                    'status': false,
                    'suffix': 'JO',
                    'company': 'JIO',
                    'phoneNumber': '9387654321',
                    'website': 'https://www.JIO.com',
                    'address': '101, Ruby Tower, dadar.',
                    'city': 'Mumbai',
                    'state': 'Maharashtra',
                    'country': 'India',
                    'zip': '400606'
                },
                {
                    'id': 3,
                    'first_name': 'Vernice',
                    'last_name': 'Cicconettii',
                    'email': 'Vernice.Cicconettii@gmail.com',
                    'status': true,
                    'suffix': 'VC',
                    'company': 'Reliance',
                    'phoneNumber': '9387654321',
                    'website': 'https://www.Reliance.com',
                    'address': '101, Ruby Tower, dadar.',
                    'city': 'Mumbai',
                    'state': 'Maharashtra',
                    'country': 'India',
                    'zip': '400606'
                }
            ]
        },
    ];

    getCatalogsList() {
        //    return this.banksInfo;
        let url = `${environment.merchandiseUrl}Merchandise/Catalog`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        return this.http.get(url, this.options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    updateCatalog(_catalog) {
        this.banksInfo = _catalog;
        return this.banksInfo;
    }
}