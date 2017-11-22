import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { RegEx } from 'app/pages/regular-expressions';

@Component({
  selector: 'app-add-cinema',
  templateUrl: './add-cinema.component.html',
  styleUrls: ['./add-cinema.component.scss']
})
export class AddCinemaComponent implements OnInit {

  addCinemaForm: FormGroup;
  showLoader = false;
  deleteLoader = false;
  categories: any;
  cinemaId: any;
  cinemaInfo: any;
  providers = ['provider 1', 'provider 2'];
  regions = ['region 1', 'region 2'];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastsManager,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params =>
      this.cinemaId = params['cinemaId']
    )
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.addCinemaForm = this.fb.group({
      'id': [''],
      'name': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ])
      ],
      'code': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ])
      ],
      'provider': [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'region': [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'latitude': [
        '',
        Validators.compose([
          Validators.pattern(RegEx.latLong)
        ])
      ],
      'longitude': [
        '',
        Validators.compose([
          Validators.pattern(RegEx.latLong)
        ])
      ],
      'bookingFee': ['']
    });
  }

  addCinema(addCinemaForm) {}

}
