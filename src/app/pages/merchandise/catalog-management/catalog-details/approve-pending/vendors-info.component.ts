import {
    Component,
    OnInit,
    Output,
    Input,
    EventEmitter,
    OnChanges
} from '@angular/core';
declare let $: any;
import * as _ from 'lodash';

import { CatalogManagementService, JsonToExcelService } from 'app/services';
import { ToastsManager } from 'ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogBulkUploadComponent } from 'app/pages/merchandise/catalog-management/bulk-upload/bulk-upload.component';

@Component({
    selector: 'app-vendors-info',
    templateUrl: './vendors-info.component.html',
    styleUrls: ['./vendors-info.component.scss']
})
export class VendorsInfoComponent implements OnInit {
    @Input() notifier;
    @Output() onStatusChange = new EventEmitter<any>();

    catalogMapOpen = false;
    approveProductsLoader = false;
    catalogId: any;
    allMapProductsApprove: any = [];
    isCheckedArray: any = [];
    productsLoader = false;
    commentDesc: any = '';
    selectAllCheckbox = false;
    showSelectedAction = false;

    constructor(
        private jsonToExcelService: JsonToExcelService,
        private modalService: NgbModal,
        private toastr: ToastsManager,
        private route: ActivatedRoute,
        private router: Router,
        private catalogManagementService: CatalogManagementService
    ) {
        this.route.params.subscribe(params => {
            this.catalogId = params['catalogId'];
        });
    }

    ngOnInit() {
        if (this.catalogId) {
            this.getMapProductForApproveFunc(this.catalogId);
        }
    }

    ngOnChanges(changes) {
        this.getMapProductForApproveFunc(this.catalogId);
    }

    getMapProductForApproveFunc(_catalogId) {
        this.catalogManagementService
            .getMapProductForApprove(_catalogId)
            .then(res => {
                if (res.Code == 200) {
                    this.allMapProductsApprove = res.Data ? res.Data : [];
                }
            });
    }

    selectAll(e) {
        if (e.target.checked) {
            // this.selectAllCheckboxMessage.message = true;
            this.selectAllCheckbox = true;
            _.forEach(this.allMapProductsApprove, item => {
                item.isChecked = true;
            });
            this.showSelectedAction = true;
        } else {
            // this.selectAllCheckboxMessage.message = false;
            this.showSelectedAction = false;
            this.selectAllCheckbox = false;
            _.forEach(this.allMapProductsApprove, item => {
                item.isChecked = false;
            });
            // if (!this.checkAllCheckboxChange) {
            //     this.showSelectedAction = false;
            // }
        }
    }

    checkBoxSelected(e, item) {
        this.selectAllCheckbox = false;
        if (e.target.checked) {
            item.isChecked = true;
        } else {
            // this.noActionSelected = false;
            item.isChecked = false;
        }

        this.isCheckedArray = [];

        _.forEach(this.allMapProductsApprove, item => {
            if (item.isChecked) {
                this.showSelectedAction = true;
                this.isCheckedArray.push(item);
            }
        });

        if (this.isCheckedArray.length === 0) {
            this.showSelectedAction = false;
        } else {
            this.showSelectedAction = true;
        }
    }

    exportAllProducts() {
        this.jsonToExcelService.exportAsExcelFile(
            this.allMapProductsApprove,
            'products'
        );
    }

    //POST Approve Map
    approveProductMap(_reason, approveStatus) {
        // console.log('this.isCheckedArray ', this.isCheckedArray);
        this.approveProductsLoader = true;
        var approveObj = {
            Id: this.catalogId,
            Reason: _reason,
            IsApproved: approveStatus
        };
        this.catalogManagementService
            .approveProductPostCatalog(approveObj)
            .then(res => {
                if (res.Success) {
                    this.toastr.success(
                        'Catalog product map approved.',
                        'Sucess!'
                    );
                    this.onStatusChange.emit(true);
                    this.allMapProductsApprove = [];
                    this.approveProductsLoader = false;
                    this.selectAllCheckbox = false;
                    this.showSelectedAction = false;
                    this.commentDesc = '';
                } else {
                    this.allMapProductsApprove = [];
                    this.commentDesc = '';
                    this.showSelectedAction = false;
                    this.selectAllCheckbox = false;
                    this.approveProductsLoader = false;
                    this.toastr.error('Something went wrong.', 'Error!');
                }
            });
    }

    bulkApprove() {
        const activeModal = this.modalService.open(CatalogBulkUploadComponent, {
            size: 'sm'
        });
        activeModal.componentInstance.catalogId = this.catalogId;
        activeModal.componentInstance.isApproval = true;

        activeModal.result
            .then(status => {
                if (status) {
                    this.onStatusChange.emit(true);
                }
            })
            .catch(status => {});
    }
}
