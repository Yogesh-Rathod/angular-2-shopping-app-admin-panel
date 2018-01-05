import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { MerchandiseService } from 'app/services';

@Component({
  selector: 'app-add-catalog',
  templateUrl: './add-catalog.component.html',
  styleUrls: ['./add-catalog.component.scss']
})

export class AddCatalogComponent implements OnInit {

  catalogId: any;
  deleteLoader = false;
  showLoader = false;
  addCatalogForm: FormGroup;
  multiDropdownSettings = {
    singleSelection: false,
    text: "Select",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: 'col-9 no_padding'
  };
  vendors = [
    {
      id: 1,
      itemName: 'Venndor 1'
    },
    {
      id: 2,
      itemName: 'Venndor 2'
    }
  ];
  programs = [
    {
      id: 1,
      itemName: 'Program 1'
    },
    {
      id: 2,
      itemName: 'Program 2'
    }
  ];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private merchandiseService: MerchandiseService,
    private toastr: ToastsManager,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params =>
      this.catalogId = params['catalogId']
    )
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.addCatalogForm = this.fb.group({
      'Id': [''],
      'Name': ['', Validators.compose([Validators.required,
      Validators.minLength(1), Validators.maxLength(100)])],
      'Description': [''],
      'vendors': [[]],
      'programs': [[]],
      'IsActive': ['TRUE', Validators.required]
    });
  }

  addCatalog(addCatalogForm) {
    console.log("addCatalogForm ", addCatalogForm);
  }

  deleteCatalog() {}
}