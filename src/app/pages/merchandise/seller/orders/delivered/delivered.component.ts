import { Component, OnInit } from '@angular/core';

import { ProductsService, OrdersService } from 'app/services';

@Component({
  selector: 'app-delivered',
  templateUrl: './delivered.component.html',
  styleUrls: ['./delivered.component.scss']
})
export class DeliveredComponent implements OnInit {

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
