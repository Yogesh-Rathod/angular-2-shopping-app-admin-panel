import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { AppStateManagementService } from 'lrshared_modules/services/app-state-management.service';
import { UserService } from 'lrshared_modules/pages/user-management/user.service';
import { environment } from 'environments/environment';
import { validators } from 'lrshared_modules/Validations';
import 'rxjs/add/operator/takeWhile';
import * as _ from 'lodash';
declare let $: any;

import { AppState } from 'app/app.service';
import { GlobalState } from 'app/global.state';

@Component({
    selector: 'editUser',
    templateUrl: './addEditUser.component.html',
    styleUrls: ['./addEditUser.component.scss'],
})

export class AddEditUserComponent implements OnInit, OnDestroy {

    routeName: any;
    addUserForm: FormGroup;
    changePasswordForm: FormGroup;
    userInfoData: any;
    userId = '';
    newUserRecord = true;
    isLoading = {
        userInfo: true,
        newUser: true,
        changePassword: true
    };
    isLoader = {
        newUser: true,
        editUser: false,
        userData: true,
        newAuth: false,
        authority: false
    };
    roleOptionSettings = {
        singleSelection: false,
        selectAllText: 'Select All',
        unSelectAllText: 'Unselect All',
        enableSearchFilter: true,
        classes: 'myclass custom-class',
        text: 'Select Roles'
    };
    userAvailable = true;
    availableUserRoles = [];
    userInfo: any = { username: 'Unknown User' };

    constructor(
        private _location: Location,
        private userService: UserService,
        public toastr: ToastsManager,
        private modalService: NgbModal,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private appStateManagementService: AppStateManagementService,
        public router: Router,
        private globals: AppState,
        private _state: GlobalState,
    ) {
        this.route.params.subscribe(params => {
            this.routeName = this.route.snapshot.data.name;

            if (this.routeName !== 'addUser') {
                if (params) {
                    this.userId = params['id'];
                }
            }
        });
        this.appStateManagementService.retrieveAppStateCK('MERCHANDISE.userData').
            then((userInfo) => {
                this.userInfo = JSON.parse(userInfo);
            }).catch((error) => {
                this.userInfo = {
                    username: 'Unknown User'
                }
            });
    }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.createForm();
        this.fetchRoles();
        if (this.userId) {
            this.fetchSingleUserData(this.userId);
            this.updatePasswordForm();
        }
    }

    createForm() {
        this.addUserForm = this.fb.group({
            Id: [''],
            UserName: ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.pattern(validators.usernameOrEmail),
            ]],
            EmailId: ['', [
                Validators.required,
                Validators.pattern(validators.email),
            ]],
            Mobile: ['', [
                Validators.required,
                Validators.pattern(validators.mobileNo),
            ]],
            // CreatedOn: [new Date().toISOString()],
            CreatedBy: [''],
            Password: ['', [
                Validators.required,
                Validators.pattern(validators.password),
            ]],
            IsActive: ['true', [
                Validators.required,
            ]],
            Roles: [[], [
                Validators.required,
            ]],
        });
    }

    updatePasswordForm() {
        this.changePasswordForm = this.fb.group({
            UserId: ['', [Validators.required]],
            Password: ['', [
                Validators.required,
                Validators.pattern(validators.password),
            ]]
        });
    }

    ngOnDestroy() {
    }

    fetchRoles() {
        this.userService.fetchRoles()
            .then((res) => {
                this.availableUserRoles = res.Data.map(item => {
                    item.id = item.Id;
                    item.itemName = item.RoleName;
                    return item;
                });
                this.isLoading.userInfo = false;
            })
            .catch(rej => { });
    }

    addUser(addForm) {
        this.isLoading.newUser = false;
        let userData = Object.assign({}, addForm);
        userData.UserCredential = {};
        userData.UserCredential.Id = 'String';
        userData.UserCredential.Password = addForm.Password;
        userData.UserCredential.IsActive = addForm.IsActive;
        userData.UserCredential.IsLocked = addForm.IsActive;
        userData.CreatedBy = this.userInfo.username;
        userData.CreatedOn = new Date().toISOString();
        delete userData.Password;
        userData.Roles = userData.Roles.map((item) => {
            item.RoleName = item.itemName;
            item.IsActive = addForm.IsActive;
            return item;
        });
        if (userData.Id) {
            // Edit User
            this.userService.updateUser(userData).then((res) => {
                console.log("updateUser res ", res);
                if (res.Code === 500) {
                    this.toastr.error(res.Message, 'Error');
                } else if (res.Code === 200) {
                    this.toastr.success('User updated successfully!');
                    this._location.back();
                }
                this.isLoading.newUser = true;
            }).catch(rej => {
                this.isLoading.newUser = true;
                this.toastr.error(rej.message);
            });
        } else {
            // Add User
            delete userData.Id;
            this.userService.addUser(userData).then((res) => {
                console.log("addUser res ", res);
                if (res.Code === 500) {
                    this.toastr.error(res.Message, 'Error');
                } else if (res.Code === 200) {
                    this.toastr.success('User successfully added!');
                    this._location.back();
                }
                this.isLoading.newUser = true;
            }).catch(rej => {
                this.isLoading.newUser = true;

                this.toastr.error(rej.message);
            });
        }
    }

    changePassword(changePasswordForm) {
        this.isLoading.changePassword = false;
        this.userService.changePassword(changePasswordForm).then((res) => {
            console.log("changePassword res ", res);
            if (res.Code === 500) {
                this.toastr.error(res.Message, 'Error');
            } else if (res.Code === 200) {
                this.toastr.success('Password updated successfully!');
                this._location.back();
            }
            this.isLoading.changePassword = true;
        }).catch(rej => {
            this.isLoading.changePassword = true;
            this.toastr.error(rej.message);
        });
    }

    fetchSingleUserData(userId?) {
        this.addUserForm.controls['Password'].setValidators(null);
        this.isLoader.userData = true;
        this.isLoader.authority = true;
        this.userAvailable = true;
        // this.isLoader.userData = false;
        this.userService.fetchSingleUser(userId).
            then((res) => {
                if (res.Code === 500) {
                    this.toastr.error(res.Message, 'Error');
                    this._location.back();
                }
                console.log("fetchSingleUser res ", res);
                this.userInfoData = res.Data;
                this.addUserForm.controls['Id'].patchValue(this.userInfoData.Id);
                this.changePasswordForm.controls['UserId'].patchValue(this.userInfoData.Id);
                this.addUserForm.controls['UserName'].patchValue(this.userInfoData.UserName);
                this.addUserForm.controls['EmailId'].patchValue(this.userInfoData.EmailId);
                this.addUserForm.controls['Mobile'].patchValue(this.userInfoData.Mobile);
                this.addUserForm.controls['IsActive'].patchValue(this.userInfoData.IsActive);
                this.userInfo.Roles = this.userInfoData.Roles.map((item) => {
                    item.id = item.Id;
                    item.itemName = item.RoleName;
                    return item;
                });
                this.addUserForm.controls['Roles'].patchValue(this.userInfo.Roles);

                this.isLoader.userData = false;
                this.isLoading.userInfo = false;
                this.checkFormValidation();

            }).catch(rej => {
                this.isLoader.userData = false;
                this.isLoading.userInfo = false;
                this.toastr.error(rej.Message, 'Error');
                this._location.back();
            });

    }

    checkFormValidation() {
        for (var i in this.addUserForm.controls) {
            this.addUserForm.controls[i].markAsTouched();
        }
    }

}
