import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import './ckeditor.loader';
import 'ckeditor';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Location } from '@angular/common';

import { Config } from 'app/pages/app-config';
import { MerchandiseService } from 'app/services';
import { CategoryDeletePopupComponent } from '../delete-popup/delete-popup.component';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  public config = {
    uiColor: '#F0F3F4',
    height: '200'
  };
  addCategoryForm: FormGroup;
  showLoader = false;
  deleteLoader = false;
  categoriesMaxLevel = Config.categoriesMaxLevel;
  categories: any;
  categoryId: any;
  categoryInfo: any;
  type = ['Merchandise', 'Gift Card'];
  level = ['Category', 'Sub Category', 'Sub Sub Category'];

  constructor(
    private location: Location,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private merchandiseService: MerchandiseService,
    private toastr: ToastsManager,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe( params =>
      this.categoryId = params['categoryId']
    )
  }

  ngOnInit() {
    this.createForm();
    this.getAllCategories();
    this.getCategoryInfoForEdit();
  }

  getAllCategories() {
    this.showLoader = true;
    this.merchandiseService.getCategories().
      then((categories) => {
        this.categories = categories.Data;
        this.showLoader = false;
      }).catch((error) => {
        console.log("error ", error);
      });
  }

  createForm() {
    this.addCategoryForm = this.fb.group({
      'Id': [''],
      'Name': ['', Validators.compose([Validators.required,
        Validators.minLength(1), Validators.maxLength(100)])],
      'Description': ['', Validators.compose([Validators.required,
        Validators.minLength(1), Validators.maxLength(1000)])],
      'ParentCategoryId': [''],
      'DisplayOrder': ['', Validators.compose([Validators.required])],
      'IsActive': ['TRUE']
    });
  }

  addCategory(addCategoryFormValues) {
    console.log("addCategoryFormValues ", addCategoryFormValues);
    this.showLoader = true;
    if (addCategoryFormValues.Id) {
    } else {
      delete addCategoryFormValues.Id;
      this.merchandiseService.addCategory(addCategoryFormValues).
        then((response) => {
          console.log("response ", response);
          if (response.Code === 200 ) {
            this.toastr.success('Category sent for approval process.', 'Sucess!');
            this.location.back();
            this.showLoader = false;
          }
        }).catch((error) => {
          console.log("error ", error);
        });
    }
  }

  imageUpload(event) {
    const uploadedImage = event.target.files[0] ? event.target.files[0].name : '';
    this.addCategoryForm.controls['picture'].setValue(uploadedImage);
  }

  getCategoryInfoForEdit() {
    if ( this.categoryId ) {
      const categories = [];
      // this.merchandiseService.getCategories();
      _.forEach(categories, (category) => {
        if (category.id === parseInt(this.categoryId) ) {
          this.categoryInfo = category;
 console.log("this.categoryInfo ", this.categoryInfo);
          this.addCategoryForm.controls['id'].setValue(category.id);
          this.addCategoryForm.controls['name'].setValue(category.name);
          // this.addCategoryForm.controls['display_name'].setValue(category.display_name);
          // this.addCategoryForm.controls['description'].setValue(category.description);
          this.addCategoryForm.controls['order'].setValue(category.display_order);
          this.addCategoryForm.controls['published'].setValue(category.published);
        }
      });
      _.forEach(categories, (category) => {
        if (this.categoryInfo.parent_name === category.breadCrumb) {
          this.addCategoryForm.controls['parentCat'].setValue(category);
        }
      });
    }
  }

  resetForm() {
    this.createForm();
  }

}
