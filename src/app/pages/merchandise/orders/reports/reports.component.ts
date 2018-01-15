import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
declare let $: any;
import { IMyDpOptions } from 'mydatepicker';

import { ProductsService, OrdersService, VendorsService, JsonToExcelService } from 'app/services';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

    searchOrdersForm: FormGroup;
    bigLoader = true;
    deleteLoader: Number;
    orders = [];
    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        editableDateField: false,
        openSelectorOnInputClick: true
    };
    vendorsList: any;
    SellerDropdownSetting = {
        singleSelection: false,
        text: "Select...",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
    };
    searchLoader = false;

    constructor(
        private jsonToExcelService: JsonToExcelService,
        private vendorsService: VendorsService,
        private fb: FormBuilder,
        private productsService: ProductsService,
        private ordersService: OrdersService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.searchForm();
        this.getAllVendors();
        this.bigLoader = false;
    }

    // For Creating Add Category Form
    searchForm() {
        this.searchOrdersForm = this.fb.group({
            SellerId: [[]],
            OrderFromDate: [''],
            OrderTillDate: [''],
            // poNumber: ['']
        });
    }

    getAllVendors() {
        // this.bigLoader = true;
        this.vendorsService.getVendors().
            then((vendors) => {
                console.log("vendors ", vendors);
                if (vendors.Code === 200) {
                    this.vendorsList = vendors.Data;
                    this.vendorsList = this.vendorsList.map((item) => {
                        item.id = item.SellerId;
                        item.itemName = `${item.FirstName} ${item.LastName}`;
                        return item;
                    });
                }
                this.bigLoader = false;
            }).catch((error) => {
                console.log("error ", error);
            })
    }

    searchOrders(searchOrdersForm) {
        this.searchLoader = true;
        this.bigLoader = true;
        if (searchOrdersForm['OrderFromDate']) {
            searchOrdersForm['OrderFromDate'] = new Date(`
            ${searchOrdersForm['OrderFromDate'].date.month}/
            ${searchOrdersForm['OrderFromDate'].date.day}/
            ${searchOrdersForm['OrderFromDate'].date.year}
            `).toISOString();
        }
        if (searchOrdersForm['OrderTillDate']) {
            searchOrdersForm['OrderTillDate'] = new Date(`
            ${searchOrdersForm['OrderTillDate'].date.month}/
            ${searchOrdersForm['OrderTillDate'].date.day}/
            ${searchOrdersForm['OrderTillDate'].date.year}
            `).toISOString();
        }

        searchOrdersForm['SellerId'] = searchOrdersForm['SellerId'].map((item) => {
            return item.SellerId;
        });
        this.ordersService.getReports(searchOrdersForm).
            then((orders) => {
                console.log(orders)
                if (orders.Code == 200) {
                    this.orders = orders.Data;
                    this.searchLoader = false;
                } else if (orders.Code === 500) {
                }
                this.searchLoader = false;
            }).catch((error) => {
                this.searchLoader = false;
                console.log("error ", error);
            });
    }
    changeRoute(status){
        this.router.navigate(['/order-management/orders', status])
    }
    downloadReport() {
        this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
    }

    resetForm() {
        this.searchForm();
    }

}
