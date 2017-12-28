import { Component, OnInit } from '@angular/core';

import { ProductsService, OrdersService } from 'app/services';

@Component({
  selector: 'app-processed',
  templateUrl: './processed.component.html',
  styleUrls: ['./processed.component.scss']
})
export class ProcessedComponent implements OnInit {

  orders: any;

  constructor(
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

}
