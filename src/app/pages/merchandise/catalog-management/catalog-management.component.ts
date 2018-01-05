import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
declare let $: any;

import { CatalogBulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { BankDeletePopupComponent } from './delete-popup/delete-popup.component';
import { CatalogManagementService } from 'app/services';

@Component({
    selector: 'app-catalog-management',
    templateUrl: './catalog-management.component.html',
    styleUrls: ['./catalog-management.component.scss']
})
export class CatalogManagementComponent implements OnInit {

    searchTerm: any;
    showLoader = false;
    catalog: any;
    filteredCatalogs: any;
    showSelectedDelete = false;
    selectAllCheckbox = false;

    constructor(
        private catalogManagementService: CatalogManagementService,
        private modalService: NgbModal,
        public toastr: ToastsManager,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.getCatalogs();
    }

    getCatalogs() {
        this.catalogManagementService.getCatalogsList().
            then((res) => {
                console.log("res ==>", res);
                this.catalog = res.Data;
                this.filteredCatalogs = this.catalog;
            });
    //    this.filteredCatalogs = this.catalog;
    }

    searchCatalog(searchText) {
        this.filteredCatalogs = this.catalog.filter((item) => {
            const caseInsensitiveSearch = new RegExp(`${searchText.trim()}`, "i");
            return caseInsensitiveSearch.test(item.name) || caseInsensitiveSearch.test(item.status);
        });
    }

    bulkUpload() {
        const activeModal = this.modalService.open(CatalogBulkUploadComponent, { size: 'sm' });
    }

    selectAll(e) {
        if (e.target.checked) {
            this.selectAllCheckbox = true;
            _.forEach(this.catalog, (item) => {
                item.isChecked = true;
            });
            this.showSelectedDelete = true;
        } else {
            this.selectAllCheckbox = false;
            _.forEach(this.catalog, (item) => {
                item.isChecked = false;
            });
            this.showSelectedDelete = false;
        }
    }

    checkBoxSelected(e, item) {
        this.selectAllCheckbox = false;
        if (e.target.checked) {
            item.isChecked = true;
        } else {
            item.isChecked = false;
        }

        let isCheckedArray = [];

        _.forEach(this.filteredCatalogs, (item) => {
            if (item.isChecked) {
                this.showSelectedDelete = true;
                isCheckedArray.push(item);
            }
        });

        if (isCheckedArray.length === 0) {
            this.showSelectedDelete = false;
        }

    }

    // deactivateAll() {
    //   if (this.selectAllCheckbox) {
    //     _.forEach(this.products, (item) => {
    //       item.status = 'Inactive';
    //       item.isChecked = false;
    //     });
    //   } else {
    //     _.forEach(this.banks, (item) => {
    //       if (item.isChecked) {
    //         item.status = 'Inactive';
    //         item.isChecked = false;
    //       }
    //     });
    //   }
    //   this.selectAllCheckbox = false;
    //   this.showSelectedDelete = false;
    // }


}
