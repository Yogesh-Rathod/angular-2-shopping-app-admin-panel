import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
declare let $: any;

import { MovieManagementService } from 'app/services';
import { MovieBulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { MovieDeletePopupComponent } from './delete-popup/delete-popup.component';

@Component({
  selector: 'app-movie-management',
  templateUrl: './movie-management.component.html',
  styleUrls: ['./movie-management.component.scss']
})
export class MovieManagementComponent implements OnInit {

  searchTerm: any;
  movies: any;
  deleteLoader: Number;

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
    console.log("this.movies ", this.movies);
  }

  searchMovie(searchTerm) {
    // console.log("searchTerm", searchTerm);
    this.searchTerm = searchTerm;
  }

  bulkUpload() {
    const activeModal = this.modalService.open(MovieBulkUploadComponent, { size: 'sm' });
  }

  deleteMovie(item, index) {
    const activeModal = this.modalService.open(MovieDeletePopupComponent, { size: 'sm' });
    activeModal.componentInstance.modalText = 'vendor';

    activeModal.result.then((status) => {
      if (status) {
        this.deleteLoader = index;
        _.remove(this.movies, item);
        this.movieManagementService.updateMovies(this.movies);
        this.deleteLoader = NaN;
        this.toastr.success('Successfully Deleted!', 'Success!');
      } else {
        this.deleteLoader = NaN;
      }
    });
  }

}
