import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
declare let $: any;
import * as _ from 'lodash';

import { IMyDpOptions } from 'mydatepicker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProductsService, OrdersService, CatalogManagementService, JsonToExcelService } from 'app/services';
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
    orderStatusDropdownSettings = {
        singleSelection: false,
        text: "Select...",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: 'col-8 no_padding'
    };
    status = 'FRESH';
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
    programName: any;
    public myDatePickerOptions: IMyDpOptions = {
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

    constructor(
        public toastr: ToastsManager,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private jsonToExcelService: JsonToExcelService,
        private productsService: ProductsService,
        private catalogManagementService: CatalogManagementService,
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
        this.getAllPrograms();
        this.getAllOrders();
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
            let copyOfStartDate = JSON.parse(JSON.stringify(this.endDateMyDatePickerOptions));
            copyOfStartDate.disableUntil = selectedDate.date;
            this.endDateMyDatePickerOptions = copyOfStartDate;
        }
    }

    // For Creating Add Category Form
    searchForm() {
        this.searchProductForm = this.fb.group({
            'e.programId': [[]],
            'e.fromDate': [''],
            'e.toDate': [''],
            'e.status': [[]],
            'e.purchaseOrderNumber': [''],
            // rtoCheck: ['']
        });
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

    getAllOrders() {
        this.bigLoader = true;
        this.ordersService.getOrdersByPONumber().
            then((orders) => {
                this.orders = orders.Data.PurchaseOrder;
                this.bigLoader = false;
                if (!orders.Success) {
                    this.toastr.error('Could not get orders.', 'Error');
                }
                this.searchLoader = false;
            }).catch((error) => {
                this.searchLoader = false;
                this.bigLoader = false;
                this.toastr.error('Could not get orders', 'Error');
            });
    }

    childStatusChanged(finished: boolean) {
        this.getAllOrders();
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
                if (item.id) {
                    status.push(item.id);
                    if (item.id.match(/cancel/i)) {
                        this.status = 'CANCEL';
                    } else {
                        this.status = item.id;
                    }
                } else {
                    status.push(item);
                }
            });
            searchOrdersForm['e.status'] = status;
        }


        if (searchOrdersForm['e.sellerId'] && searchOrdersForm['e.sellerId'].length > 0) {
            if (typeof searchOrdersForm['e.sellerId'][0] === 'object') {
                searchOrdersForm['e.sellerId'] = searchOrdersForm['e.sellerId'].map(item => {
                    return item.SellerId;
                });
                searchOrdersForm['e.sellerId'] = searchOrdersForm['e.sellerId'].join(',');
            }
        }

        let programId = [];
        if (searchOrdersForm['e.programId'] && searchOrdersForm['e.programId'].length > 0) {
            if (typeof searchOrdersForm['e.programId'][0] === 'object') {
                _.forEach(searchOrdersForm['e.programId'], (item) => {
                    programId.push(item.id);
                });
                searchOrdersForm['e.programId'] = programId;
                searchOrdersForm['e.programId'] = searchOrdersForm['e.programId'].join(',');
            }
        }

        searchOrdersForm = JSON.stringify(searchOrdersForm);
        searchOrdersForm = searchOrdersForm.replace(/{|}|[\[\]]|/g, '').replace(/":"/g, '=').replace(/","/g, '&').replace(/"/g, '');
        return searchOrdersForm;
    }

    downloadPDF(searchOrdersForm) {
        this.searchLoader = true;
        searchOrdersForm = this.generateSearchFilters(searchOrdersForm);

        this.ordersService.downloadPOPdf('', searchOrdersForm).
            then((orders) => {
                this.searchLoader = false;
            }).catch((error) => {
                this.searchLoader = false;
            })
    }

    exportAllOrders(searchOrdersForm) {

        this.searchLoader = true;
        searchOrdersForm = this.generateSearchFilters(searchOrdersForm);
        this.ordersService.getOrdersByPONumber(null, searchOrdersForm, '').
            then((orders) => {
                if (orders.Data) {
                    this.jsonToExcelService.exportAsExcelFile(orders.Data.PurchaseOrder, 'orders');
                }
                this.searchLoader = false;
                if (!orders.Success) {
                    this.toastr.error('Could not get orders for export.', 'Error');
                }
            }).catch((error) => {
                this.toastr.error('Could not get orders for export.', 'Error');
                this.searchLoader = false;
            })
    }

    searchProduct(searchOrdersForm) {
        this.orders = [];
        this.searchLoader = true;
        this.bigLoader = true;
        searchOrdersForm = this.generateSearchFilters(searchOrdersForm);

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
                this.searchLoader = false;
                this.toastr.error('Could not get orders.', 'Error');
                this.bigLoader = false;
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
