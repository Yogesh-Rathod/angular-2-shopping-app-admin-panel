import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
declare let $: any;

import { MovieManagementService } from 'app/services';
import { MovieBulkUploadComponent } from './bulk-upload/bulk-upload.component';
// import { CategoryDeletePopupComponent } from './delete-popup/delete-popup.component';

@Component({
  selector: 'app-movie-management',
  templateUrl: './movie-management.component.html',
  styleUrls: ['./movie-management.component.scss']
})
export class MovieManagementComponent implements OnInit {

  searchTerm: any;
  movies: any;

  constructor(
    private modalService: NgbModal,
    public toastr: ToastsManager,
    private fb: FormBuilder,
    private movieManagementService: MovieManagementService) {
  }

  ngOnInit() {
    $(document).ready(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.getAllMovies();
  }

  getAllMovies() {
    this.movies = this.movieManagementService.getMovies();
  }

  searchMovie(searchTerm) {
    // console.log("searchTerm", searchTerm);
    this.searchTerm = searchTerm;
  }

  bulkUpload() {
    const activeModal = this.modalService.open(MovieBulkUploadComponent, { size: 'sm' });
  }

}
