import { Component, OnInit } from '@angular/core';

import { ProductsService, OrdersService, JsonToExcelService } from 'app/services';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerOrdersBulkUploadComponent } from '../bulk-upload/bulk-upload.component';

@Component({
  selector: 'app-processed',
  templateUrl: './processed.component.html',
  styleUrls: ['./processed.component.scss']
})
export class ProcessedComponent implements OnInit {

  orders: any;
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
          this.orders = orders.Data.PurchaseOrder;
          this.orders = this.orders.filter(item => {
            return item.Status === 'PROCESSED'
          })
      })
  }

    importOrders() {
      const activeModal = this.modalService.open(SellerOrdersBulkUploadComponent, { size: 'sm' });
      activeModal.componentInstance.fileUrl = 'ProcessedToDispached.xlsx';
      activeModal.componentInstance.request = 'processed';
        activeModal.result.then(status => {
            console.log("status", status);
            if (status) {
                this.getAllOrders();
            }
        }).catch(status => { })
    }

    exportProducts() {
      this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
    }

}
