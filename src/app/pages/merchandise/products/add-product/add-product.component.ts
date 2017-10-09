import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import './ckeditor.loader';
import 'ckeditor';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { MerchandiseService } from 'app/services';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  
  addProductForm: FormGroup;
  public config = {
    uiColor: '#F0F3F4',
    height: '200'
  };
  productId: any;

  constructor(
    private fb: FormBuilder,
    private merchandiseService: MerchandiseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params =>
      this.productId = params['productId']
    )
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.addProductForm = this.fb.group({
      'id': [''],
      'name': ['', Validators.compose([Validators.required,
      Validators.minLength(1), Validators.maxLength(100)])],
      'description': ['', Validators.compose([Validators.required,
      Validators.minLength(1), Validators.maxLength(1000)])],
      'picture': [''],
      'parentCat': [''],
      'order': ['', Validators.compose([Validators.required])],
      'published': ['']
    });
  }

  deleteProduct() {}

}
