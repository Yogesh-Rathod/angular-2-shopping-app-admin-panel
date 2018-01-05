import { Injectable } from '@angular/core';

@Injectable()
export class VendorsService {

    constructor() { }

    // All Operations Related To Vendors
    private vendors: any[] = [
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
        },
        {
            'id': 4,
            'first_name': 'Benjy',
            'last_name': 'Bugby',
            'email': 'Benjy.Bugby@gmail.com',
            'status': false,
            'suffix': 'VC',
            'company': 'Reliance',
            'phoneNumber': '9387654321',
            'website': 'https://www.Reliance.com',
            'address': '101, Ruby Tower, dadar.',
            'city': 'Mumbai',
            'state': 'Maharashtra',
            'country': 'India',
            'zip': '400606'
        },
        {
            'id': 5,
            'first_name': 'Wallis',
            'last_name': 'Stemp',
            'email': 'Wallis.Stemp@gmail.com',
            'status': false,
            'suffix': 'VC',
            'company': 'Reliance',
            'phoneNumber': '9387654321',
            'website': 'https://www.Reliance.com',
            'address': '101, Ruby Tower, dadar.',
            'city': 'Mumbai',
            'state': 'Maharashtra',
            'country': 'India',
            'zip': '400606'
        },
        {
            'id': 6,
            'first_name': 'Guss',
            'last_name': 'Deboo',
            'email': 'Guss.Deboo@gmail.com',
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
        },
        {
            'id': 7,
            'first_name': 'Hubey',
            'last_name': 'Manie',
            'email': 'Hubey.Manie@gmail.com',
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
        },
        {
            'id': 8,
            'first_name': 'Jacki',
            'last_name': 'Kryszkiecicz',
            'email': 'Hubey.Manie@gmail.com',
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
        },
        {
            'id': 9,
            'first_name': 'Pasquale',
            'last_name': 'Warner',
            'email': 'Hubey.Manie@gmail.com',
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
        },
        {
            'id': 10,
            'first_name': 'Pamelina',
            'last_name': 'Whitehall',
            'email': 'Hubey.Manie@gmail.com',
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
        },
        {
            'id': 11,
            'first_name': 'Harv',
            'last_name': 'Rapsey',
            'email': 'Hubey.Manie@gmail.com',
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
        },
        {
            'id': 12,
            'first_name': 'Millicent',
            'last_name': 'Woodall',
            'email': 'Hubey.Manie@gmail.com',
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
        },
    ];

    getVendors() {
        return this.vendors;
    }

    addVendor(vendor) {
        this.vendors.push(vendor);
        return this.vendors;
    }

    editVendor(vendors) {
        this.vendors = vendors;
        return this.vendors;
    }

}