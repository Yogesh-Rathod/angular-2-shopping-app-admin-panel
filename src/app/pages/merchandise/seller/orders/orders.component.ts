import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
declare let $: any;
import * as _ from 'lodash';

import { IMyDpOptions } from 'mydatepicker';

import { ProductsService, OrdersService } from 'app/services';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  searchProductForm: FormGroup;
  bigLoader = true;
  searchLoader = false;
  orders: any;
  orderStatus = [
    {
      id: 'Fresh',
      itemName: 'Fresh'
    },
    {
      id: 'Processed',
      itemName: 'Processed'
    },
    {
      id: 'Shipped',
      itemName: 'Shipped'
    },
    {
      id: 'Delivered',
      itemName: 'Delivered'
    },
    {
      id: 'Cancelled',
      itemName: 'Cancelled'
    },
  ];
  orderStatusDropdownSettings = {
    singleSelection: false,
    text: "Select...",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: 'col-8 no_padding'
  };
  programName = ['RBI', 'SBI', 'TOI'];
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    openSelectorOnInputClick: true
  };

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    $(document).ready(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.searchForm();
    this.getAllOrders();
    this.bigLoader = false;
  }

  // For Creating Add Category Form
  searchForm() {
    this.searchProductForm = this.fb.group({
      'e.programName': [''],
      'e.orderFromDate': [''],
      'e.orderTillDate': [''],
      'e.status': [[]],
      'e.purchaseOrderNumber': [''],
      // rtoCheck: ['']
    });
  }

  getAllOrders() {
    this.ordersService.getOrdersByPONumber().
      then((orders) => {
          console.log("orders", orders);
          this.orders = orders.Data;
      })
    // this.orders = this.ordersService.getOrders();
  }

  searchProduct(searchOrdersForm) {
      this.searchLoader = true;
    if (searchOrdersForm['e.orderFromDate']) {
        searchOrdersForm['e.orderFromDate'] = new Date(`
            ${searchOrdersForm['e.orderFromDate'].date.month}/
            ${searchOrdersForm['e.orderFromDate'].date.day}/
            ${searchOrdersForm['e.orderFromDate'].date.year}
            `).toISOString();
    }

    if (searchOrdersForm['e.orderTillDate']) {
        searchOrdersForm['e.orderTillDate'] = new Date(`
        ${searchOrdersForm['e.orderTillDate'].date.month}/
        ${searchOrdersForm['e.orderTillDate'].date.day}/
        ${searchOrdersForm['e.orderTillDate'].date.year}
        `).toISOString();
    }
    let status = [];
    if (searchOrdersForm['e.status'].length > 0) {
        _.forEach(searchOrdersForm['e.status'], (item) => {
            status.push(item.itemName);
        });
        searchOrdersForm['e.status'] = status;
    }

    searchOrdersForm = JSON.stringify(searchOrdersForm);
    searchOrdersForm = searchOrdersForm.replace(/{|}|"/g,'', '');
    searchOrdersForm = searchOrdersForm.replace(':', '=');

    console.log('searchOrdersForm', searchOrdersForm);
    this.ordersService.getOrdersByPONumber(null, searchOrdersForm).
        then((orders) => {
            // this.orders = orders.Data;
            console.log("orders ", orders);
            this.bigLoader = false;
            this.searchLoader = false;
        }).catch((error) => {
            console.log("error ", error);
        })
  }

  searchByOrderHash(orderHash) {
    this.router.navigate(['order-details', orderHash], { relativeTo: this.route });
  }

  resetForm() {
    this.searchForm();
  }

}
