import { Component, OnInit } from '@angular/core';

import { ProductsService, OrdersService, JsonToExcelService } from 'app/services';

@Component({
  selector: 'app-fresh',
  templateUrl: './fresh.component.html',
  styleUrls: ['./fresh.component.scss']
})
export class FreshComponent implements OnInit {

  orders: any;

  constructor(
    private jsonToExcelService: JsonToExcelService,
    private productsService: ProductsService,
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders() {
    this.orders = this.ordersService.getOrders();
    console.log("this.orders ", this.orders);
  }

  exportProducts() {
    this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
  }

}
