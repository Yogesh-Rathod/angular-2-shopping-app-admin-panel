import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

const uploadApiUrl = 'http://localhost:3000/upload';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class VendorsBulkUploadComponent implements OnInit {

  submitDisabled = true;
  showUploadError = false;
  showLoader = false;
  public uploader: FileUploader = new FileUploader(
    {
      url: uploadApiUrl,
      itemAlias: 'image'
    }
  );

  constructor(
    private toastr: ToastsManager,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      if (file) {
        this.showUploadError = false;
        this.submitDisabled = false;
      } else {
        this.submitDisabled = true;
      }
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.showLoader = false;
      const JSONResponse = JSON.parse(response);
      if (JSONResponse.status === 200) {
        this.closeModal();
        this.toastr.success('Sucessfully Uploaded!', 'Sucess!');
      } else {
        this.showUploadError = true;
      }
    };
  }

  uploadFile(event) {
    event.preventDefault();
    this.uploader.uploadAll();
    this.submitDisabled = true;
    this.showLoader = true;
  }

  closeModal() {
    this.activeModal.close();
  }

}
