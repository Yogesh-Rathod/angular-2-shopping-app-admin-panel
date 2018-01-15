import { Component, OnInit, Input } from '@angular/core';
declare let $: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  @Input() orderInfo: any;

  constructor() { }

  ngOnInit() {
  }

}
