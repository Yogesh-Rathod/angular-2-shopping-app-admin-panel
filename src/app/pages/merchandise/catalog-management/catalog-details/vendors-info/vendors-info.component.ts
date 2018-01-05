import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-vendors-info',
  templateUrl: './vendors-info.component.html',
  styleUrls: ['./vendors-info.component.scss']
})
export class VendorsInfoComponent implements OnInit {

  @Input() bankInfo: any;
  showSelectedDelete = false;
  selectAllCheckbox = false;
  addNewVendor = false;
  selectedvendors = [];
  vendorsDropdownSettings = {
    singleSelection: false,
    text: "Select Vendors",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true
  };
  vendors = [
    {
      id: 'vendor 1',
      itemName: 'vendor 1'
    },
    {
      id: 'vendor 2',
      itemName: 'vendor 2'
    },
    {
      id: 'vendor 3',
      itemName: 'vendor 3'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  selectAll(e) {
    if (e.target.checked) {
      this.selectAllCheckbox = true;
      _.forEach(this.bankInfo.vendors, (item) => {
        item.isChecked = true;
      });
      this.showSelectedDelete = true;
    } else {
      this.selectAllCheckbox = false;
      _.forEach(this.bankInfo.vendors, (item) => {
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

    _.forEach(this.bankInfo.vendors, (item) => {
      if (item.isChecked) {
        this.showSelectedDelete = true;
        isCheckedArray.push(item);
      }
    });

    if (isCheckedArray.length === 0) {
      this.showSelectedDelete = false;
    }

  }

  deactivateAll() {
    if (this.selectAllCheckbox) {
      _.forEach(this.bankInfo.vendors, (item) => {
        item.status = false;
        item.isChecked = false;
      });
    } else {
      _.forEach(this.bankInfo.vendors, (item) => {
        if (item.isChecked) {
          item.status = false;
          item.isChecked = false;
        }
      });
    }
    this.showSelectedDelete = false;
    this.selectAllCheckbox = false;
  }

  deleteAll() {
    // const activeModal = this.modalService.open(ProductsDeletePopupComponent, { size: 'sm' });

    // activeModal.result.then((status) => {
    // if (status) {
    this.bankInfo.vendors = [];
    // this.toastr.success('Successfully Deleted!', 'Success!');
    this.selectAllCheckbox = false;
    this.showSelectedDelete = false;
    // }
    // });
  }

  deleteProduct(item, index) {
    // const activeModal = this.modalService.open(ProductsDeletePopupComponent, { size: 'sm' });

    // activeModal.result.then((status) => {
    // if (status) {
    // this.deleteLoader = index;
    // _.remove(this.products, item);
    // this.productsService.editProduct(this.products);
    // this.deleteLoader = NaN;
    // this.toastr.success('Successfully Deleted!', 'Success!');
    // }
    // });

  }

}
