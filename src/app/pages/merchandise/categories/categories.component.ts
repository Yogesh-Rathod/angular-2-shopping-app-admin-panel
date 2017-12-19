import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  categories: any;
  categoriesFiltered: any;
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
    this.categoriesFiltered = this.categories;
    // console.log("this.categories", this.categories);
    this.generateTreeStructure(this.categories);
  }

  generateTreeStructure(array) {
    let tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

    // First map the nodes of the array to an object -> create a hash table.
    let arrayLength = array.length;
    for (let i = 0; i < arrayLength; i++) {
      arrElem = array[i];
      mappedArr[arrElem.id] = arrElem;
      mappedArr[arrElem.id]['children'] = [];
    }


    for (let id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.parentid) {
          mappedArr[mappedElem['parentid']]['children'].push(mappedElem);
        }
        // If the element is at the root level, add it to first level elements array.
        else {
          tree.push(mappedElem);
        }
      }
    }
    console.log("tree ", tree);
    return tree;
  }

  searchCategory(searchTerm) {
    this.categoriesFiltered = this.categories.filter((item) => {
      const caseInsensitiveSearch = new RegExp(`${searchTerm.trim()}`, "i");
      return caseInsensitiveSearch.test(item.breadCrumb);
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
