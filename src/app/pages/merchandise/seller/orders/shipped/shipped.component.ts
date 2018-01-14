import { Component, OnInit } from '@angular/core';

import { ProductsService, OrdersService, JsonToExcelService } from 'app/services';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerOrdersBulkUploadComponent } from '../bulk-upload/bulk-upload.component';

@Component({
  selector: 'app-shipped',
  templateUrl: './shipped.component.html',
  styleUrls: ['./shipped.component.scss']
})
export class ShippedComponent implements OnInit {

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
          this.orders = orders.Data;
          console.log("orders", orders);
      })
    // this.orders = this.ordersService.getOrders();
    console.log("this.orders ", this.orders);
  }

    importOrders() {
      const activeModal = this.modalService.open(SellerOrdersBulkUploadComponent, { size: 'sm' });
      activeModal.componentInstance.fileUrl = 'ShippedToDelivered.xlsx';
      activeModal.componentInstance.request = 'shipped';
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
