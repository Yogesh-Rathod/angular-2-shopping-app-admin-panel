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
      console.log("ImageUpload:uploaded:", item, status, response);
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
    console.log("event ", event);
    let file = event.target.files[0];
    this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
      console.log("data ", data['sheets'].Sheet1);
      this.result = JSON.stringify(data['sheets'].Sheet1);
    });
  }

  uploadFile(event) {
    console.log("uploadF ");
    event.preventDefault();
    this.uploader.uploadAll();
    this.submitDisabled = true;
    this.showLoader = true;
  }

  closeModal() {
  	this.activeModal.close();
  }

}
