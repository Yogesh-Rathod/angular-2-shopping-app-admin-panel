import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


import { environment } from 'environments/environment';
import { ChangePasswordService, AppStateManagementService } from 'lrshared_modules/services';
import { AuthenticationService } from 'lrshared_modules/services/authentication.service';

declare let $: any;

@Component({
  selector: 'app-change-password',
  styleUrls: [
    './change-password.component.scss'
  ],
  templateUrl: './change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {

  modalHeader: string;
  form: FormGroup;
  passwordNotMatching = false;
  passwordAfterConfirm = false;

  errorWrongCurrentPassword = false;
  isLoading = false;

  constructor(
    private appStateManagementService: AppStateManagementService,
    private changePasswordService: ChangePasswordService,
    private toastr: ToastsManager,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,    
    private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.createForm();

    $(document).ready( () => {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  createForm() {
    this.form = this.fb.group({
      'currentPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'newPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'confirmPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
  }

  changePassword(formValues) {
    this.isLoading = true;
    this.changePasswordService.changePassword(formValues)
      .then(() => {
        this.isLoading = false;
        this.activeModal.close();
        this.authenticationService.initiateLogout();
        return this.toastr.success('Password changed successfully, please re-login to continue!', 'Success!', { toastLife: 3000 } );
      })
      .catch(error => {
        this.isLoading = false;
        if (error.responseCode === 4005) {
          this.errorWrongCurrentPassword = true;
        }
        return this.toastr.error(error.message);
      })
  }

  checkConfirmPassword() {
    this.passwordAfterConfirm = true;
    this.passwordNotMatching = this.form.value.newPassword !== this.form.value.confirmPassword;
  }

  checkPassword() {
    if (this.passwordAfterConfirm) {
      this.passwordNotMatching = this.form.value.newpassword !== this.form.value.confirmnewpassword;
    }
  }

  closeModal() {
    this.activeModal.close();
  }

}
