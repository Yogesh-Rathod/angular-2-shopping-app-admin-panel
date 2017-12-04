import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
declare let $: any;
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
  programName = ['RBI', 'SBI', 'TOI'];
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
    this.searchProductForm = this.fb.group({
      programName: [''],
      supplierName: [''],
      startDate: [''],
      endDate: [''],
      orderStatus: [[]],
      poNumber: [''],
    });
  }

  getAllOrders() {
    this.orders = this.ordersService.getOrders();
  }

  searchProduct(searchProductForm) {
    console.log('searchProductForm', searchProductForm);
  }

  searchByOrderHash(orderHash) {
    this.router.navigate( ['order-details', orderHash], { relativeTo: this.route });
  }

  resetForm() {
    this.searchForm();
  }

}
