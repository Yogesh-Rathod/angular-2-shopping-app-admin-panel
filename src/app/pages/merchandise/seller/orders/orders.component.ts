import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
declare let $: any;
import * as _ from 'lodash';

import { IMyDpOptions } from 'mydatepicker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProductsService, OrdersService } from 'app/services';
import { SellerOrdersBulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { ToastsManager } from 'ng2-toastr';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

    searchProductForm: FormGroup;
    bigLoader = true;
    searchLoader = false;
    orders: any;
    orderStatus = [
        {
            id: 'Fresh',
            itemName: 'Fresh'
        },
        {
            id: 'Processed',
            itemName: 'Processed'
        },
        {
            id: 'Shipped',
            itemName: 'Shipped'
        },
        {
            id: 'Delivered',
            itemName: 'Delivered'
        },
        {
            id: 'Cancelled',
            itemName: 'Cancelled'
        },
    ];
    orderStatusDropdownSettings = {
        singleSelection: false,
        text: "Select...",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: 'col-8 no_padding'
    };
    programName = [{ id: 'ff8081815fbfbcaf015fc488a8e20002', itemName: 'LVB'}];
    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        editableDateField: false,
        openSelectorOnInputClick: true,
        disableSince: this.disableSince()
    };

    constructor(
        public toastr: ToastsManager,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private productsService: ProductsService,
        private ordersService: OrdersService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.bigLoader = true;
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.searchForm();
        this.getAllOrders();
        this.bigLoader = false;
    }

    disableSince() {
        let d = new Date();
        const disableSince = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate() + 1
        };
        return disableSince;
    }

    // For Creating Add Category Form
    searchForm() {
        this.searchProductForm = this.fb.group({
            'e.programName': [[]],
            'e.fromDate': [''],
            'e.toDate': [''],
            'e.status': [[]],
            'e.purchaseOrderNumber': [''],
            // rtoCheck: ['']
        });
    }

    getAllOrders() {
        this.bigLoader = true;
        this.ordersService.getOrdersByPONumber().
            then((orders) => {
                console.log("orders", orders);
                this.orders = orders.Data.PurchaseOrder;
                this.bigLoader = false;
            }).catch((error) => {
                this.toastr.error('Could not get orders', 'Error');
            });
        // this.orders = this.ordersService.getOrders();
    }

    childStatusChanged(finished: boolean) {
        this.getAllOrders();
    }

    searchProduct(searchOrdersForm) {
        this.orders = [];
        this.searchLoader = true;
        this.bigLoader = true;

        for (let key in searchOrdersForm) {
            if (searchOrdersForm.hasOwnProperty(key)) {
                let value = searchOrdersForm[key];
                if (!value || value.length === 0) {
                    delete searchOrdersForm[key];
                }
                if (typeof searchOrdersForm[key] === 'string') {
                    searchOrdersForm[key] = searchOrdersForm[key].trim();
                }
            }
        }

        if (searchOrdersForm['e.fromDate']) {
            searchOrdersForm['e.fromDate'] = `${searchOrdersForm['e.fromDate'].date.month}/${searchOrdersForm['e.fromDate'].date.day}/${searchOrdersForm['e.fromDate'].date.year}`;
            searchOrdersForm['e.fromDate'] = encodeURIComponent(searchOrdersForm['e.fromDate']);
        }

        if (searchOrdersForm['e.toDate']) {
            searchOrdersForm['e.toDate'] = `${searchOrdersForm['e.toDate'].date.month}/${searchOrdersForm['e.toDate'].date.day}/${searchOrdersForm['e.toDate'].date.year}`;
            searchOrdersForm['e.toDate'] = encodeURIComponent(searchOrdersForm['e.toDate']);
        }
        let status = [];
        if (searchOrdersForm['e.status'] && searchOrdersForm['e.status'].length > 0) {
            _.forEach(searchOrdersForm['e.status'], (item) => {
                status.push(item.itemName);
            });
            searchOrdersForm['e.status'] = status;
        }

        if (searchOrdersForm['e.sellerId'] && searchOrdersForm['e.sellerId'].length > 0) {
            searchOrdersForm['e.sellerId'] = searchOrdersForm['e.sellerId'].map(item => {
                return item.SellerId;
            });
            searchOrdersForm['e.sellerId'] = searchOrdersForm['e.sellerId'].join(',')
        }

        let programName = [];
        if (searchOrdersForm['e.programName'] && searchOrdersForm['e.programName'].length > 0) {
            _.forEach(searchOrdersForm['e.programName'], (item) => {
                programName.push(item.itemName);
            });
            searchOrdersForm['e.programName'] = programName;
        }

        searchOrdersForm = JSON.stringify(searchOrdersForm);
        searchOrdersForm = searchOrdersForm.replace(/{|}|[\[\]]|/g, '').replace(/":"/g, '=').replace(/","/g, '&').replace(/"/g, '');

        console.log('searchOrdersForm', searchOrdersForm);
        this.ordersService.getOrdersByPONumber(null, searchOrdersForm).
            then((orders) => {
                this.orders = orders.Data.PurchaseOrder;
                console.log("orders ", orders);
                this.bigLoader = false;
                this.searchLoader = false;
            }).catch((error) => {
                console.log("error ", error);
            })
    }

    searchByOrderHash(orderHash) {
        this.router.navigate(['order-details', orderHash], { relativeTo: this.route });
    }

    bulkCancel() {
        const activeModal = this.modalService.open(SellerOrdersBulkUploadComponent, { size: 'sm' });
        activeModal.componentInstance.fileUrl = 'cancelOrder.xlsx';
        activeModal.componentInstance.request = 'cancel';
        activeModal.result.then(status => {
            if (status) {
                this.getAllOrders();
            }
        }).catch(status => { })
    }

    resetForm() {
        this.searchForm();
        this.getAllOrders();
    }

}
