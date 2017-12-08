import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AES } from "crypto-js/aes";
import * as CryptoJS from "crypto-js";
import * as utf8 from 'utf8';

import * as _ from 'lodash';
declare let $: any;

import { MerchandiseService } from 'app/services';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { CategoryDeletePopupComponent } from './delete-popup/delete-popup.component';

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.component.html',
  styleUrls: ['categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories: any[] = [];
  searchTerm: any;
  showLoader = false;
  deleteLoader: Number;

  constructor(
    private modalService: NgbModal,
    public toastr: ToastsManager,
    private fb: FormBuilder,
    private merchandiseService: MerchandiseService) {
  }

  ngOnInit() {
    $(document).ready(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.getAllCategories();
    this.createHMACSignature();
  }

  getAllCategories() {
    this.categories = this.merchandiseService.getCategories();
    // console.log("this.categories", this.categories);
  }

  searchCategory(searchTerm) {
    // console.log("searchTerm", searchTerm);
    this.searchTerm = searchTerm;
  }

  deleteCategory(item, index) {

    const activeModal = this.modalService.open(CategoryDeletePopupComponent, { size: 'sm' });

    activeModal.result.then((status) => {
      if (status) {
        this.deleteLoader = index;
        _.remove(this.categories, item);
        this.merchandiseService.editCategories(this.categories);
        this.deleteLoader = NaN;
        this.toastr.success('Successfully Deleted!', 'Success!');
      }
    });
  }

  bulkUpload() {
    const activeModal = this.modalService.open( BulkUploadComponent, { size: 'sm' } );
  }

  createHMACSignature() {
    let requestUrl = encodeURI('http://localhost:3000/'),
        timestamp = + new Date(),
        nounce = btoa(CryptoJS.lib.WordArray.random(8)),
        signatureRaw = `clientIdget${requestUrl}${timestamp}${nounce}`;

    let content = {
      username: 'Yogesh',
      password: 'Password'
    };
    let contentString = '';

    if (content) {
      contentString = JSON.stringify(content);
      let updatedContent = btoa( CryptoJS.SHA256(  CryptoJS.MD5( utf8.encode(contentString)  )  ) );
      signatureRaw = signatureRaw + updatedContent;
    }

    const clientSecret = utf8.encode('clientSecret');
    signatureRaw = utf8.encode(signatureRaw);

    const finalSignature = btoa(CryptoJS.HmacSHA256(signatureRaw, clientSecret) );

    console.log("finalSignature ", finalSignature);
    return `clientId:${finalSignature}:${nounce}:${timestamp}`;
  }


}
