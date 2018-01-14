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
     this.ordersService.getOrdersByPONumber().
      then((orders) => {
          this.orders = orders.Data.PurchaseOrder;
          this.orders = this.orders.filter(item => {
            return item.Status === 'DELIVERED'
          })
      })
  }

}
