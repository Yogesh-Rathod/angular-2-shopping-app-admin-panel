import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

import { VendorsService } from 'app/services';
import { VendorsBulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { VendorDeletePopupComponent } from './delete-popup/delete-popup.component';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: [`./vendor.component.scss`],
})
export class VendorComponent implements OnInit {

  vendorsList: any;
  filteredVendorsList: any;
  searchTerm: any;
  bigLoader = false;
  deleteLoader: Number;
  showSelectedDelete = false;
  selectAllCheckbox = false;

  constructor(
    private modalService: NgbModal,
    public toastr: ToastsManager,
    private route: ActivatedRoute,
    private router: Router,
    private vendorsService: VendorsService) {
  }

  ngOnInit() {
    $(document).ready(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.getAllVendors();
  }

  selectAll(e) {
    if (e.target.checked) {
      this.selectAllCheckbox = true;
      _.forEach(this.vendorsList, (item) => {
        item.isChecked = true;
      });
      this.showSelectedDelete = true;
    } else {
      this.selectAllCheckbox = false;
      _.forEach(this.vendorsList, (item) => {
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

    _.forEach(this.vendorsList, (item) => {
      if (item.isChecked) {
        this.showSelectedDelete = true;
        isCheckedArray.push(item);
      }
    });

    if (isCheckedArray.length === 0) {
      this.showSelectedDelete = false;
    }

  }

  getAllVendors() {
    this.vendorsList = this.vendorsService.getVendors();
    this.filteredVendorsList = this.vendorsList;
  }

  searchVendor(searchText) {
    this.filteredVendorsList = this.vendorsList.filter((item) => {
      const caseInsensitiveSearch = new RegExp(`${searchText.trim()}`, "i");
      return caseInsensitiveSearch.test(item.first_name) || caseInsensitiveSearch.test(item.last_name) || caseInsensitiveSearch.test(item.email) || caseInsensitiveSearch.test(item.suffix);
    });
  }

  deactivateAll() {
    if (this.selectAllCheckbox) {
      _.forEach(this.vendorsList, (item) => {
        item.status = false;
        item.isChecked = false;
      });
    } else {
      _.forEach(this.vendorsList, (item) => {
        if (item.isChecked) {
          item.status = false;
          item.isChecked = false;
        }
      });
    }
    this.selectAllCheckbox = false;
    this.showSelectedDelete = false;
  }

  deleteAll() {
    const activeModal = this.modalService.open(VendorDeletePopupComponent, { size: 'sm' });
    activeModal.componentInstance.modalText = 'vendors';

    activeModal.result.then((status) => {
      if (status) {
        this.vendorsList = [];
        this.toastr.success('Successfully Deleted!', 'Success!');
        this.selectAllCheckbox = false;
        this.showSelectedDelete = false;
      }
    });
  }

  bulkUpload() {
    const activeModal = this.modalService.open(VendorsBulkUploadComponent, { size: 'sm' });
  }

  deleteVendor(item, index) {
    const activeModal = this.modalService.open(VendorDeletePopupComponent, { size: 'sm' });
    activeModal.componentInstance.modalText = 'vendor';

    activeModal.result.then( (status) => {
      if (status) {
        this.deleteLoader = index;
        _.remove(this.vendorsList, item);
        this.vendorsService.editVendor(this.vendorsList);
        this.deleteLoader = NaN;
        this.toastr.success('Successfully Deleted!', 'Success!');
      }
    });
  }

}
