import { Component, OnInit } from '@angular/core';

import { ProductsService, OrdersService, JsonToExcelService } from 'app/services';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerOrdersBulkUploadComponent } from '../bulk-upload/bulk-upload.component';

@Component({
  selector: 'app-fresh',
  templateUrl: './fresh.component.html',
  styleUrls: ['./fresh.component.scss']
})
export class FreshComponent implements OnInit {

   orders: any;
  selectAllCheckbox = false;
  showSelectedAction = false;

  constructor(
    private modalService: NgbModal,
    private jsonToExcelService: JsonToExcelService,
    private productsService: ProductsService,
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders() {
    this.ordersService.getOrdersByPONumber().
      then((orders) => {
          this.orders = orders.Data;
          console.log("orders", orders);
      })
    // this.orders = this.ordersService.getOrders();
    console.log("this.orders ", this.orders);
  }

  selectAll(e) {
        if (e.target.checked) {
            this.selectAllCheckbox = true;
            _.forEach(this.orders, (item) => {
                item.isChecked = true;
            });
            this.showSelectedAction = true;
        } else {
            // this.noActionSelected = false;
            this.selectAllCheckbox = false;
            _.forEach(this.orders, (item) => {
                item.isChecked = false;
            });
            this.showSelectedAction = false;
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

        let isCheckedArray = [];

        _.forEach(this.orders, (item) => {
            if (item.isChecked) {
                this.showSelectedAction = true;
                isCheckedArray.push(item);
            }
        });

        if (isCheckedArray.length === 0) {
            this.showSelectedAction = false;
        }

    }

    updateToProcessed() {
      // this.approveLoader = true;
      let productsToApprove = [];
        if (this.selectAllCheckbox) {
            _.forEach(this.orders, (item) => {
                productsToApprove.push({
                  PurchaseOrderNumber: item.PurchaseOrderNumber
                });
                item.isChecked = false;
            });
        } else {
            _.forEach(this.orders, (item) => {
                if (item.isChecked) {
                    productsToApprove.push({
                      PurchaseOrderNumber: item.PurchaseOrderNumber
                    });
                    item.isChecked = false;
                }
            });
        }
        this.ordersService.sendToProcessed(productsToApprove).
            then((success) => {
                console.log("success ", success);
                if (success.Code === 200) {
                    this.getAllOrders();
                }
            }).catch((error) => {
                console.log("error ", error);
            })
        console.log("productsToApprove ", productsToApprove);
        this.selectAllCheckbox = false;
        this.showSelectedAction = false;
    }

    importOrders() {
      const activeModal = this.modalService.open(SellerOrdersBulkUploadComponent, { size: 'sm' });
      activeModal.componentInstance.fileUrl = 'freshToProcessed.xlsx';
      activeModal.componentInstance.request = 'fresh';
        activeModal.result.then(status => {
            if (status) {
                this.getAllOrders();
            }
        }).catch(status => { })
    }

    exportProducts() {
      this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
    }

}
