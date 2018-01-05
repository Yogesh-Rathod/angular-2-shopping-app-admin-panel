import { Injectable } from '@angular/core';

@Injectable()
export class CatalogManagementService {

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

    getBanks() {
        return this.banksInfo;
    }

    updateBanks(banks) {
        this.banksInfo = banks;
        return this.banksInfo;
    }
}