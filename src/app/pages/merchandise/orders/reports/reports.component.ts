import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
declare let $: any;
import { IMyDpOptions } from 'mydatepicker';

import { ProductsService, OrdersService } from 'app/services';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  searchOrdersForm: FormGroup;
  bigLoader = true;
  deleteLoader: Number;
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
  stores = ['store 1', 'store 2', 'store 3'];
  paymentMethod = ['All', 'Check / Money Order', 'Credit Card', 'PayPal Standard', 'Purchase Order'];
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
    this.searchOrdersForm = this.fb.group({
      supplierName: [''],
      startDate: [''],
      endDate: [''],
      poNumber: ['']
    });
  }

  getAllOrders() {
    this.orders = this.ordersService.getOrders();
  }

  searchOrders(searchOrdersForm) {
    console.log('searchOrdersForm', searchOrdersForm);
  }

  resetForm() {
    this.searchForm();
  }

}
