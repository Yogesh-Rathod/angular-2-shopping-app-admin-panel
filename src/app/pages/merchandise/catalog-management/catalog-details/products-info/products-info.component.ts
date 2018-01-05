import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-products-info',
  templateUrl: './products-info.component.html',
  styleUrls: ['./products-info.component.scss']
})
export class ProductsInfoComponent implements OnInit {

  @Input() bankInfo: any;
  showSelectedDelete = false;
  selectAllCheckbox = false;
  bankId: any;

  constructor() { }

  ngOnInit() {
    this.bankId = this.bankInfo.id;
  }

  selectAll(e) {
    if (e.target.checked) {
      this.selectAllCheckbox = true;
      _.forEach(this.bankInfo.productsInfo, (item) => {
        item.isChecked = true;
      });
      this.showSelectedDelete = true;
    } else {
      this.selectAllCheckbox = false;
      _.forEach(this.bankInfo.productsInfo, (item) => {
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

    _.forEach(this.bankInfo.productsInfo, (item) => {
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
      _.forEach(this.bankInfo.productsInfo, (item) => {
        item.status = 'Inactive';
        item.isChecked = false;
      });
    } else {
      _.forEach(this.bankInfo.productsInfo, (item) => {
        if (item.isChecked) {
          item.status = 'Inactive';
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
        this.bankInfo.productsInfo = [];
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
