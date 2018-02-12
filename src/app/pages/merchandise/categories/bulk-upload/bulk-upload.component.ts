import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

const uploadApiUrl = 'http://localhost:3000/upload';
import { XlsxToJsonService } from 'app/services';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {

  submitDisabled = true;
  showUploadError = false;
  showLoader = false;
  public uploader: FileUploader = new FileUploader(
    {
      url: uploadApiUrl,
      itemAlias: 'image'
    }
  );
  result: any;

  constructor(
    private xlsxToJsonService: XlsxToJsonService,
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

  handleFile(event) {
    let file = event.target.files[0];
    if (file) {
      this.showLoader = true;
      let objectkey = '';
      this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
        if (data['sheets']) {
          const sheetKey = Object.keys(data['sheets']);
          this.result = data['sheets'][sheetKey[0]];
          if (this.result) {
            this.showLoader = false;
            this.submitDisabled = false;
          }
        }
      });
    } else {
      this.submitDisabled = true;
    }
  }

  uploadFile(event) {
    this.showLoader = true;
    event.preventDefault();
    this.uploader.uploadAll();
    this.submitDisabled = true;
  }

  closeModal() {
    this.activeModal.close();
  }

}
