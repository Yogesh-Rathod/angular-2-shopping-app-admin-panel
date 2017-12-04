import { Component, OnInit, Input } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
declare let $: any;

@Component({
  selector: 'app-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.scss']
})
export class ShippingInfoComponent implements OnInit {

  @Input() orderInfo: any;
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    openSelectorOnInputClick: true
  };
  shippingInfoForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    $(document).ready(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.shippingForm();
  }

  shippingForm() {
    this.shippingInfoForm = this.fb.group({
      rtoReport: [''],
      comments: [''],
      AWBNumber: [''],
      courierName: [''],
      dispatchDate: [''],
      deliveryDate: ['']
    });
  }

  updateShippingInfoForm(shippingInfo) {
    console.log("shippingInfo ", shippingInfo);

  }

  resetForm() {
    this.shippingForm();
  }

}
