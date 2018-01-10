import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SellsBulkUploadComponent } from 'app/pages/merchandise/seller/seller-products/bulk-upload/bulk-upload.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-seller-products',
  templateUrl: './seller-products.component.html',
  styleUrls: ['./seller-products.component.scss']
})
export class SellerProductsComponent implements OnInit {
  searchProductForm: FormGroup;

  constructor(
    private fb:FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.searchForm();
  }
  //bulk upload
  bulkUpload() {
    const activeModal = this.modalService.open(SellsBulkUploadComponent, { size: 'sm' });
}

  // For Creating Add Category Form
  searchForm() {
    this.searchProductForm = this.fb.group({
      name: [''],
      code: [''],
      parentCode: [''],
      category: [''],
      productType: [''],
      manufacturer: [''],
      status: [''],
      vendor: [''],
      approvalStatus: ['']
    });
  }

}
