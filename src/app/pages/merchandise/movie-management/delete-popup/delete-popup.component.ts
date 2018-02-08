import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-delete-popup',
    templateUrl: './delete-popup.component.html',
    styleUrls: ['./delete-popup.component.scss']
})
export class DeleteMoviePopupComponent implements OnInit {

    movieText: string;

    constructor(
        private activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
        // this.movietext = this.activeModal.
    }

    closeModal(status) {
        this.activeModal.close(status);
    }

}
