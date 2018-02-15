import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
declare let $: any;

import { IMyDpOptions } from 'mydatepicker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProductsService, OrdersService, JsonToExcelService, VendorsService,
    CatalogManagementService } from 'app/services';
import { SellerOrdersAdminBulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { ToastsManager } from 'ng2-toastr';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

    status: any;
    searchProductForm: FormGroup;
    bigLoader = true;
    orders: any;
    orderStatusDropdownSettings = {
        singleSelection: true,
        text: "Select...",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: 'col-8 no_padding'
    };
    statusList = [
        {
            id: 'FRESH',
            itemName: 'Fresh'
        },
        {
            id: 'PROCESSED',
            itemName: 'Processed'
        },
        {
            id: 'DISPATCHED',
            itemName: 'Dispatched'
        },
        {
            id: 'DELIVERED',
            itemName: 'Delivered'
        },
        {
            id: 'Pending For Cancellation',
            itemName: 'Cancelled'
        }
    ];
    searchLoader = false;
    programName: any;
    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        editableDateField: false,
        openSelectorOnInputClick: true,
        disableSince: this.disableSince()
    };
    vendorsList: any;

    constructor(
        public toastr: ToastsManager,
        private modalService: NgbModal,
        private vendorsService: VendorsService,
        private catalogManagementService: CatalogManagementService,
        private jsonToExcelService: JsonToExcelService,
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
        this.getAllPrograms();
        this.getAllOrders();
        this.status = this.route.params;
        if (this.status._value.orderStatus != undefined) {
            this.status = this.status._value.orderStatus;
            if (this.status.match(/rto/i)) {
                this.status = 'RTO';
            } else if (this.status.match(/cancel/i)) {
                this.status = 'CANCEL';
            } else if (this.status.match(/process/i)) {
                this.status = 'PROCESSED';
            } else if (this.status.match(/dispatch/i)) {
                this.status = 'DISPATCHED';
            } else if (this.status.match(/deliver/i)) {
                this.status = 'DELIVERED';
            } else {
                this.status = 'FRESH';
            }
        } else {
            this.status = 'FRESH';
        }
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

    getAllPrograms() {
        this.catalogManagementService.getAllProgramList().then(res => {
            if (res.Success) {
                this.programName = res.Data;
                this.programName = this.programName.map((item) => {
                    item.id = item.Id;
                    item.itemName = item.ProgramName;
                    return item;
                });
            }
        })
    }

    getAllVendors() {
        this.vendorsService.getVendors().
            then((vendors) => {
                this.vendorsList = vendors.Data;
                this.vendorsList = this.vendorsList.map((item) => {
                    item.id = item.SellerId;
                    item.itemName = `${item.FirstName} ${item.LastName}`;
                    return item;
                });
            }).catch((error) => {
            })
    }

    // For Creating Add Category Form
    searchForm() {
        this.searchProductForm = this.fb.group({
            'e.programName': [[]],
            'e.sellerId': [[]],
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
                this.orders = orders.Data.PurchaseOrder ? orders.Data.PurchaseOrder : '';
                this.bigLoader = false;
            }).catch((error) => {
                this.bigLoader = false;
                this.toastr.error('Could not get orders', 'Error');
            });
    }

    childStatusChanged(finished: boolean) {
        this.getAllOrders();
    }

    exportOrders() {
        this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
    }

    searchProduct(searchOrdersForm) {

        this.searchLoader = true;
        this.bigLoader = true;

        for (let key in searchOrdersForm) {
            // check also if property is not inherited from prototype
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

        if (searchOrdersForm['e.fromDate'] && typeof searchOrdersForm['e.fromDate'] == 'object') {
            searchOrdersForm['e.fromDate'] = `${searchOrdersForm['e.fromDate'].date.month}/${searchOrdersForm['e.fromDate'].date.day}/${searchOrdersForm['e.fromDate'].date.year}`;
            searchOrdersForm['e.fromDate'] = encodeURIComponent(searchOrdersForm['e.fromDate']);
        }

        if (searchOrdersForm['e.toDate'] && typeof searchOrdersForm['e.toDate'] === 'object') {
            searchOrdersForm['e.toDate'] = `${searchOrdersForm['e.toDate'].date.month}/${searchOrdersForm['e.toDate'].date.day}/${searchOrdersForm['e.toDate'].date.year}`;
            searchOrdersForm['e.toDate'] = encodeURIComponent(searchOrdersForm['e.toDate']);
        }

        let status = [];
        if (searchOrdersForm['e.status'] && searchOrdersForm['e.status'].length > 0) {
            _.forEach(searchOrdersForm['e.status'], (item) => {
                status.push(item.id);
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

        this.ordersService.getOrdersByPONumber(null, searchOrdersForm).
            then((orders) => {
                if (orders.Data) {
                    this.orders = orders.Data.PurchaseOrder;
                }
                this.bigLoader = false;
                this.searchLoader = false;
                if (!orders.Success) {
                    this.toastr.error('Could not get orders.', 'Error');
                }
            }).catch((error) => {
                this.toastr.error('Could not get orders.', 'Error');
                this.bigLoader = false;
            })
    }

    bulkCancel() {
        const activeModal = this.modalService.open(SellerOrdersAdminBulkUploadComponent, { size: 'sm' });
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
