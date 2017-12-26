import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { AppStateManagementService } from 'lrshared_modules/services/app-state-management.service';
import { UserService } from 'lrshared_modules/pages/user-management/user.service';
import { AddEditAuthorityComponent } from 'lrshared_modules/pages/user-management/addEditAuthority/addEditAuthority.component';
import { environment } from 'environments/environment';
import { validators } from 'lrshared_modules/Validations';
import 'rxjs/add/operator/takeWhile';
import { getAuthority } from 'lrshared_modules/rbacConfig';

import { AppState } from 'app/app.service';
import { CommonService } from 'lrshared_modules/services/common-services.service';
import { GlobalState } from 'app/global.state';

@Component({
    selector: 'editUser',
    templateUrl: './addEditUser.component.html',
    styleUrls: ['./addEditUser.component.scss'],
})

export class AddEditUserComponent implements OnInit, OnDestroy {

    routeName: any;
    globalInfo: any;
    roleData: any;
    addUserForm: FormGroup;
    userInfoData: any;
    pushUserInfo = [];
    assignedProgram = [];
    userAccessData = [];
    userId = '';
    userSubmited = true;
    newUserRecord = true;
    isLoading = {
        userInfo: true,
        newUser: true,
    };
    isLoader = {
        newUser: false,
        editUser: false,
        userData: true,
        newAuth: false,
        authority: false
    };
    alive: boolean = true;
    getAuthority = getAuthority;
    addAuthorityOfUser = false;
    isCrm = environment.appName === 'CRM';
    roleOptionSettings = {
        singleSelection: this.isCrm,
        selectAllText: 'Select All',
        unSelectAllText: 'Unselect All',
        enableSearchFilter: true,
        classes: 'myclass custom-class',
        text: this.isCrm ? 'Select Role' : 'Select Roles'
    };
    programOptionSettings = {
        singleSelection: false,
        selectAllText: 'Select All',
        unSelectAllText: 'Unselect All',
        enableSearchFilter: true,
        classes: 'myclass custom-class',
        text: 'Select Modules',
        disabled: false
    };
    userAvailable = true;
    modulesList = [{id: 1, itemName: '1'}];
    availableUserRoles = [{id:1, itemName: '1'}];
    userInfo: any = { username: 'Unknown User' };

    constructor(
        private userService: UserService,
        public toastr: ToastsManager,
        private modalService: NgbModal,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private appStateManagementService: AppStateManagementService,
        public router: Router,
        private globals: AppState,
        private _state: GlobalState,
        private commonService: CommonService,
    ) {
        this.route.params.subscribe(params => {
            this.routeName = this.route.snapshot.data.name;

            if (this.routeName !== 'addUser') {
                if (params) {
                    this.userId = params['id'];
                    // this.fetchSingleUserData(this.userId);
                    // this.checkAuthority();
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
        this.createForm();
        // this.getApplicationData();
        this.fetchRoles();
        this.fetchModules();
        if (this.userId) {
            this.fetchSingleUserData(this.userId);
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
            CreatedOn: [new Date().toISOString()],
            CreatedBy: [this.userInfo.username],
            Password: ['', [
                Validators.required,
                Validators.minLength(4),
                // Validators.pattern(validators.usernameOrEmail),
            ]],
            IsActive: ['true', [
                Validators.required,
            ]],
            UserModules: [[], [
                Validators.required,
            ]],
            Roles: [[], [
                Validators.required,
            ]],
        });
    }

    ngOnDestroy() {
        this.alive = false;
    }

    checkAuthority() {
        if (environment.appName === 'CRM') {
            if (!this.getAuthority('addRoles')) {
                this.router.navigate(['/']);
            }
        }
    }

    fetchRoles() {
        this.userService.fetchRoles()
            .then((res) => {
                this.availableUserRoles = res.Data.map(item => {
                    item.id = item.Id;
                    item.itemName = item.RoleName;
                    return item;
                });
            })
            .catch(rej => { });
    }

    fetchModules() {
        this.userService.fetchModules()
            .then((res) => {
                this.modulesList = res.Data.map(item => {
                    item.id = item.Id;
                    item.itemName = item.ModuleName;
                    return item;
                });
            })
            .catch(rej => { });
    }

    /************ Add new User **********/
    addUser(addForm) {
        console.log("addForm ", addForm);
        let userData = Object.assign({}, addForm);
        userData.UserCredential = {};
        userData.UserCredential.Password = addForm.Password;
        userData.UserCredential.IsActive = addForm.IsActive;
        delete userData.Password;
        delete userData.IsActive;
        userData.Roles = userData.Roles.map((item) => {
            item.RoleName = item.itemName;
            item.IsActive = addForm.IsActive;
            delete item.id; delete item.itemName;
            return item;
        });
        userData.UserModules = userData.UserModules.map((item) => {
            item.ModuleName = item.itemName;
            item.IsActive = addForm.IsActive;
            delete item.id; delete item.itemName;
            return item;
        });
        // this.isLoading.newUser = false;
        // this.newUserRecord = false;
        // this.assignedProgram = addForm.program;

        console.log("userData ", userData);
        if (userData.Id) {
            // Edit Form Code
        } else {
            delete userData.Id;
            this.userService.addUser(JSON.stringify(userData)).then((res) => {
                try {
                    this.newUserRecord = true;
                    this.userId = res.payload.id;

                    // Create UPA and then assign CRM program to agent
                    this.addUserInProgram(res.payload);

                    // Create Agent
                    addForm.email = addForm.username;
                    this.addAgent(addForm, res.payload.id);
                } catch (ex) {
                    console.log(ex);
                }
            }).catch(rej => {
                this.isLoading.newUser = true;
                this.newUserRecord = true;

                this.toastr.error(rej.message);
            });
        }
    }

    addUserInProgram(createdUserRes) {
        let i = 0;
        for (const selectedProgram of this.assignedProgram) {
            this.pushUserInfo = [];
            this.pushUserInfo.push({ 'program': selectedProgram });
            this.pushUserInfo.push({ 'user': createdUserRes });
            this.pushUserInfo.push({ 'application': this.globalInfo[0] });
            // Assign role
            // Create UPA
            this.userService.assignProgramUser(
                JSON.stringify(this.pushUserInfo),
                createdUserRes.id,
                selectedProgram.id,
                this.globalInfo[0].id
            )
                .then((res) => {
                    this.isLoading.newUser = true;
                    // this.assignRole(res.payload.id, selectedProgram, i === this.assignedProgram.length - 1);
                    ++i;

                    // Assign program to user if CRM USer
                    if (environment.appName === 'CRM') {
                        this.assignAgentProgram(createdUserRes.email, selectedProgram);
                    }
                }).catch(rej => {
                    this.isLoading.newUser = true;
                });
        }
    }

    addAgent(data, userId) {
        this.userService.addAgent(JSON.stringify(data)).then((res) => {
            this.isLoader.newUser = true;
            this.toastr.success(res.message);
            // Add user and route to edit user
            // this.router.navigate([`user_management/edit/${userId}`]);
        }).catch(rej => { });
    }

    // Assign Program to agent if CRM USER
    assignAgentProgram(userId, selectedProgram) {
        this.userService.assignAgentProgram(userId, selectedProgram.programId).then((res) => {
        }).catch(rej => { });
    }


    // Fetch ser info after creating user
    fetchSingleUserData(userId) {
        this.isLoader.userData = true;
        this.isLoader.authority = true;
        this.userAvailable = true;
        // this.isLoader.userData = false;
        this.userService.fetchSingleUser(userId).
            then((res) => {
                if (res.payload.length !== 0) {
                    this.userInfoData = res.Data;
                    // this.userAccessData = res.payload;
                    this.userAvailable = true;
                }
                this.isLoader.userData = false;
                this.isLoader.authority = false;

            }).catch(rej => {
                this.isLoader.userData = false;
                this.isLoader.authority = false;
                this.userAvailable = false;
            });


        this.userInfoData = {
            "Id": "ec5a9eb8-d752-4a33-8c41-760296fc595e",
            "UserName": "yogesh",
            "EmailId": "yogesh.rathod@loylty.in",
            "Mobile": "8286875250",
            "IsActive": false,
            "CreatedOn": "2017-12-22T10:48:51",
            "CreatedBy": "yogesh",
            "ModifiedOn": null,
            "ModifiedBy": null,
            "Roles": [
                {
                    "Id": "f0ede6b9-e3b3-11e7-8376-00155d0a0867",
                    "RoleName": "SuperAdmin",
                    "Description": "Super Admin",
                    "IsActive": true,
                    "CreatedOn": "2017-12-18T00:00:00",
                    "ModifiedOn": "2017-12-18T00:00:00"
                }
            ],
            "UserModules": [
                {
                    "Id": "aa7b3eb7-e5f4-11e7-ae2f-00155dc90735",
                    "ModuleName": "ParentTestModule2",
                    "Description": "parent test module 2",
                    "IsActive": true,
                    "ParentModuleId": null,
                    "CreatedOn": "2017-12-18T00:00:00",
                    "ModifiedOn": "2017-12-18T00:00:00",
                    "ChildModules": [
                        {
                            "Id": "bfa54f10-e5f4-11e7-ae2f-00155dc90735",
                            "ModuleName": "ChildModule3",
                            "Description": "Child Module 3",
                            "IsActive": true,
                            "ParentModuleId": "aa7b3eb7-e5f4-11e7-ae2f-00155dc90735",
                            "CreatedOn": "2017-12-18T00:00:00",
                            "ModifiedOn": "2017-12-18T00:00:00",
                            "ChildModules": []
                        }
                    ]
                }
            ]
        };
        this.addUserForm.controls['Id'].patchValue(this.userInfoData.Id);
        this.addUserForm.controls['UserName'].patchValue(this.userInfoData.UserName);
        this.addUserForm.controls['EmailId'].patchValue(this.userInfoData.EmailId);
        this.addUserForm.controls['Mobile'].patchValue(this.userInfoData.Mobile);
        this.addUserForm.controls['Password'].patchValue(this.userInfoData.Password);
        this.addUserForm.controls['IsActive'].patchValue(this.userInfoData.IsActive);
        this.userInfo.Roles = this.userInfoData.Roles.map((item) => {
            item.id = item.Id;
            item.itemName = item.RoleName;
            return item;
        });
        this.addUserForm.controls['Roles'].patchValue(this.userInfo.Roles);
        this.userInfo.UserModules = this.userInfoData.UserModules.map((item) => {
            item.id = item.Id;
            item.itemName = item.ModuleName;
            return item;
        });
        this.addUserForm.controls['UserModules'].patchValue(this.userInfoData.UserModules);
    }

    // Edit particular authority
    editAuth(userData) {
        const modal = this.modalService.open(AddEditAuthorityComponent, { size: 'lg', backdrop: 'static', keyboard: false });
        modal.result
            .then((data) => {
                if (data) {
                    setTimeout(() => {
                        this.fetchSingleUserData(this.userId);
                    }, 200);
                }
            });
        modal.componentInstance.userId = this.userId;
        modal.componentInstance.assignedRoles = userData.roles;
        modal.componentInstance.programName = userData.loyltyProgram;
        modal.componentInstance.id = userData.id;
    }

    // Add authority if no authority available
    addAuthority() {
        const modal = this.modalService.open(AddEditAuthorityComponent, { size: 'lg', backdrop: 'static', keyboard: false });
        modal.result
            .then((data) => {
                if (data) {
                    setTimeout(() => {
                        this.fetchSingleUserData(this.userId);
                    }, 200);
                }
            });
        modal.componentInstance.userId = this.userId;
        modal.componentInstance.assignedRoles = '';
    }

    // Edit user information
    // editUser(editForm) {
    //     this.isLoading.userInfo = false;
    //     this.userSubmited = false;
    //     const userId = this.route.snapshot.params['id'];
    //     this.userService.updateUser(editForm, this.userInfoData.username).then((res) => {
    //         this.fetchSingleUserData(this.userId);
    //         this.isLoading.userInfo = true;
    //         this.userSubmited = true;
    //         this.toastr.success('Information has been updated');
    //     }).catch(rej => {
    //         this.isLoading.userInfo = true;
    //         this.userSubmited = true;
    //         this.toastr.error(rej.message);
    //     });
    // }

    // Get app data (application id and name)
    getApplicationData() {
        this.globalInfo = this.globals.get('applicationData');
        this._state.subscribe('applicationData', (applicationData) => {
            this.globalInfo = applicationData;
        });
    }

    getUserInfo(userName) {
        this.userService.getUserInfo(userName).then((res) => {
            this.addUserInProgram(res.payload);
        }).catch(rej => { console.log(rej); });
    }

    crmUser(userId) {
        this.userService.userByUserId(userId).then((res) => {
            console.log(res.payload);
        }).catch(rej => { console.log(rej); });
    }

}
