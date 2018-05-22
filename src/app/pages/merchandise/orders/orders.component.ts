import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
    FormBuilder
} from '@angular/forms';
import * as _ from 'lodash';
declare let $: any;

import { IMyDpOptions } from 'mydatepicker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
    ProductsService,
    OrdersService,
    JsonToExcelService,
    VendorsService,
    CatalogManagementService
} from 'app/services';
import { SellerOrdersAdminBulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { ToastsManager } from 'ng2-toastr';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
    searchProductForm: FormGroup;
    bigLoader = true;
    orders: any;
    orderStatusDropdownSettings = {
        singleSelection: false,
        text: 'Select...',
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
        },
        {
            id: 'RTO-FRESH,RTO-DELIVERED,RTO-PROCESSED,RTO-DISPATCHED',
            itemName: 'RTO'
        }
    ];
    searchLoader = false;
    programName: any;
    myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        editableDateField: false,
        openSelectorOnInputClick: true,
        disableSince: this.disableSince()
    };
    endDateMyDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        editableDateField: false,
        openSelectorOnInputClick: true,
        disableSince: this.disableSince()
    };
    vendorsList: any;
    pageSize: any;
    hasFilters = false;

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
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.searchForm();
        this.getAllVendors();
        this.getAllPrograms();
        this.getAllOrders();
    }

    checkIfFromSLAReport() {
        setTimeout(() => {
            let urlStatus: any = this.route.params;
            if (urlStatus._value.orderStatus) {
                urlStatus = urlStatus._value.orderStatus;
                if (urlStatus.match(/rto/i)) {
                    $(`[href="#RTO"]`).tab('show');
                } else if (urlStatus.match(/cancel/i)) {
                    $(`[href="#CANCEL"]`).tab('show');
                } else if (urlStatus.match(/process/i)) {
                    $(`[href="#PROCESSED"]`).tab('show');
                } else if (urlStatus.match(/dispatch/i)) {
                    $(`[href="#DISPATCHED"]`).tab('show');
                } else if (urlStatus.match(/deliver/i)) {
                    $(`[href="#DELIVERED"]`).tab('show');
                } else if (urlStatus.match(/fresh/i)) {
                    $(`[href="#FRESH"]`).tab('show');
                }
            }
        }, 500);
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

    disableUntil(selectedDate) {
        this.searchProductForm.controls['e.toDate'].patchValue(null);
        if (selectedDate) {
            let copyOfStartDate = JSON.parse(
                JSON.stringify(this.endDateMyDatePickerOptions)
            );
            copyOfStartDate.disableUntil = selectedDate.date;
            this.endDateMyDatePickerOptions = copyOfStartDate;
        }
    }

    getAllPrograms() {
        this.catalogManagementService.getAllProgramList().then(res => {
            if (res.Success) {
                this.programName = res.Data;
                this.programName = this.programName.map(item => {
                    item.id = item.Id;
                    item.itemName = item.ProgramName;
                    return item;
                });
            }
        });
    }

    getAllVendors() {
        this.vendorsService
            .getVendors()
            .then(vendors => {
                this.vendorsList = vendors.Data;
                this.vendorsList = this.vendorsList.map(item => {
                    item.id = item.SellerId;
                    item.itemName = item.Company;
                    return item;
                });
            })
            .catch(error => {});
    }

    // For Creating Add Category Form
    searchForm() {
        this.searchProductForm = this.fb.group({
            'e.programId': [[]],
            'e.sellerId': [[]],
            'e.fromDate': [''],
            'e.toDate': [''],
            'e.status': [[]],
            'e.purchaseOrderNumber': ['']
            // rtoCheck: ['']
        });
    }

    getAllOrders(isRefresh?) {
        this.bigLoader = true;
        this.ordersService
            .getOrdersByPONumber()
            .then(orders => {
                this.orders = orders.Data.PurchaseOrder
                    ? orders.Data.PurchaseOrder
                    : '';
                this.pageSize = orders.Data.TotalCounts;
                this.bigLoader = false;
                this.searchLoader = false;
                this.hasFilters = false;
                if(!isRefresh) {
                    this.checkIfFromSLAReport();
                }
            })
            .catch(error => {
                this.searchLoader = false;
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

    generateSearchFilters(searchOrdersForm) {
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

        if (
            searchOrdersForm['e.fromDate'] &&
            typeof searchOrdersForm['e.fromDate'] == 'object'
        ) {
            searchOrdersForm['e.fromDate'] = `${
                searchOrdersForm['e.fromDate'].date.month
            }/${searchOrdersForm['e.fromDate'].date.day}/${
                searchOrdersForm['e.fromDate'].date.year
            }`;
            searchOrdersForm['e.fromDate'] = encodeURIComponent(
                searchOrdersForm['e.fromDate']
            );
        }

        if (
            searchOrdersForm['e.toDate'] &&
            typeof searchOrdersForm['e.toDate'] === 'object'
        ) {
            searchOrdersForm['e.toDate'] = `${
                searchOrdersForm['e.toDate'].date.month
            }/${searchOrdersForm['e.toDate'].date.day}/${
                searchOrdersForm['e.toDate'].date.year
            }`;
            searchOrdersForm['e.toDate'] = encodeURIComponent(
                searchOrdersForm['e.toDate']
            );
        }

        let status = [];
        if (
            searchOrdersForm['e.status'] &&
            searchOrdersForm['e.status'].length > 0 &&
            typeof searchOrdersForm['e.status'] !== 'string'
        ) {
            _.forEach(searchOrdersForm['e.status'], item => {
                if (item.id) {
                    status.push(item.id);
                } else {
                    status.push(item);
                }
            });
            $(`[href="#${status[0]}"]`).tab('show');
            if (status[0].match(/cancel/i)) {
                $(`[href="#CANCEL"]`).tab('show');
            }
            if (status[0].match(/rto/i)) {
                $(`[href="#RTO"]`).tab('show');
            }
            searchOrdersForm['e.status'] = status.join(',');
        }

        if (
            searchOrdersForm['e.sellerId'] &&
            searchOrdersForm['e.sellerId'].length > 0
        ) {
            if (typeof searchOrdersForm['e.sellerId'][0] === 'object') {
                searchOrdersForm['e.sellerId'] = searchOrdersForm[
                    'e.sellerId'
                ].map(item => {
                    return item.SellerId;
                });
                searchOrdersForm['e.sellerId'] = searchOrdersForm[
                    'e.sellerId'
                ].join(',');
            }
        }

        let programId = [];
        if (
            searchOrdersForm['e.programId'] &&
            searchOrdersForm['e.programId'].length > 0
        ) {
            if (typeof searchOrdersForm['e.programId'][0] === 'object') {
                _.forEach(searchOrdersForm['e.programId'], item => {
                    programId.push(item.id);
                });
                searchOrdersForm['e.programId'] = programId;
                searchOrdersForm['e.programId'] = searchOrdersForm[
                    'e.programId'
                ].join(',');
            }
        }

        searchOrdersForm = JSON.stringify(searchOrdersForm);
        searchOrdersForm = searchOrdersForm
            .replace(/{|}|[\[\]]|/g, '')
            .replace(/":"/g, '=')
            .replace(/","/g, '&')
            .replace(/"/g, '');
        return searchOrdersForm;
    }

    downloadPDF(searchOrdersForm) {
        this.searchLoader = true;
        searchOrdersForm = this.generateSearchFilters(searchOrdersForm);

        this.ordersService
            .downloadPOPdf('', searchOrdersForm)
            .then(orders => {
                this.searchLoader = false;
            })
            .catch(error => {
                this.searchLoader = false;
            });
    }

    exportAllOrders(searchOrdersForm) {
        this.searchLoader = true;
        searchOrdersForm = this.generateSearchFilters(searchOrdersForm);

        this.ordersService
            .getOrdersByPONumber(null, searchOrdersForm, this.pageSize)
            .then(orders => {
                if (orders.Data) {
                    this.jsonToExcelService.exportAsExcelFile(
                        orders.Data.PurchaseOrder,
                        'orders'
                    );
                }
                this.searchLoader = false;
                if (!orders.Success) {
                    this.toastr.error(
                        'Could not get orders for export.',
                        'Error'
                    );
                }
            })
            .catch(error => {
                this.toastr.error('Could not get orders for export.', 'Error');
                this.searchLoader = false;
            });
    }

    searchProduct(searchOrdersForm) {
        this.searchLoader = true;
        this.bigLoader = true;
        searchOrdersForm = this.generateSearchFilters(searchOrdersForm);

        this.ordersService
            .getOrdersByPONumber(null, searchOrdersForm)
            .then(orders => {
                if (orders.Data) {
                    this.orders = orders.Data.PurchaseOrder;
                    this.pageSize = orders.Data.TotalCounts;
                }
                this.bigLoader = false;
                this.searchLoader = false;
                this.hasFilters = true;
                if (!orders.Success) {
                    this.toastr.error('Could not get orders.', 'Error');
                }
            })
            .catch(error => {
                this.searchLoader = false;
                this.toastr.error('Could not get orders.', 'Error');
                this.bigLoader = false;
            });
    }

    bulkCancel() {
        const activeModal = this.modalService.open(
            SellerOrdersAdminBulkUploadComponent,
            { size: 'sm' }
        );
        activeModal.componentInstance.fileUrl = 'cancelOrder.xlsx';
        activeModal.componentInstance.request = 'cancel';
        activeModal.result
            .then(status => {
                if (status) {
                    this.getAllOrders();
                }
            })
            .catch(status => {});
    }

    resetForm() {
        this.searchForm();
        this.getAllOrders(true);
        $(`[href="#FRESH"]`).tab('show');
    }
}
