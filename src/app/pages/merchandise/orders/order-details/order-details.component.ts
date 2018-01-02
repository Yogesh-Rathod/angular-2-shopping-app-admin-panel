import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { OrdersService } from 'app/services';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  orderId: any;
  orderInfo: any;
  orders: any;
  deleteLoader = false;
  bigLoader = false;

  constructor(
    private _location: Location,
    public toastr: ToastsManager,
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params =>
      this.orderId = params['orderId']
    )
  }

  ngOnInit() {
    this.getOrderDetails();
  }

  getOrderDetails() {
    if (this.orderId) {
      this.orders = this.ordersService.getOrders();
      _.forEach(this.orders, (order) => {
        if (order.id === parseInt(this.orderId)) {
          this.orderInfo = order;
          console.log("this.orderInfo ", this.orderInfo);
        }
      });
    }
  }

  deleteOrder() {
    this.deleteLoader = true;
    _.remove(this.orders, this.orderInfo);
    this.ordersService.editOrder(this.orders)
    this.deleteLoader = false;
    this.toastr.success('Successfully Deleted!', 'Success!');
    this._location.back();
  }

  goBack() {
    this._location.back();
  }

}
