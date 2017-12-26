import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AppStateManagementService } from 'lrshared_modules/services/app-state-management.service';
import { UserService } from 'lrshared_modules/pages/user-management/user.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/takeWhile';
import { getAuthority } from 'lrshared_modules/rbacConfig';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'user',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})

export class UserManagementComponent implements OnInit, OnDestroy {
    disabledButton: boolean;
    availableUserListData = [];
    userListData = [];
    filter: FormGroup;
    isLoading = {
        userList: true
    };
    alive: boolean = true;

    getAuthority = getAuthority;
    isCrm = environment.appName === 'CRM';
    itemsPerPage: number = environment.crm.itemsPerPage;
    p: number = 1;

    constructor(
        public toastr: ToastsManager,
        private appStateManagementService: AppStateManagementService,
        private userService: UserService,
        public router: Router,
        private fb: FormBuilder,
    ) {
        this.userList();
        // this.checkAuthority();
    }

    ngOnInit() {
        this.filter = this.fb.group({
            searchText: ['']
        });
    }

    checkAuthority() {
        // Remove this line
        this.isCrm = true;
        if (this.isCrm) {
            if (!this.getAuthority('showUserManagement')) {
                // this.router.navigate(['/']);
            }
        }
    }


    ngOnDestroy() {
        // this.alive = false;
    }

    userList() {
        this.isLoading.userList = true;
        this.userListData = [
            {
                subject: {
                    id: 1235,
                    name: 'Yogesh',
                    username: 'yogesh.rathod',
                    email: 'yrathod101@gmail.com',
                    mobile: '8286875250',
                    status: 'Active',
                },
                loyltyProgram: {
                    programName: 'Some Program'
                }
            }
        ];
        this.isLoading.userList = false;
        // this.userService.getAllUsers()
        //     .then((res) => {
        //         this.availableUserListData = res.payload;
        //         this.userListData = res.payload;
        //         this.isLoading.userList = false;
        //     })
        //     .catch(rej => {
        //         this.isLoading.userList = false;
        //         this.toastr.error(rej.message);
        //     });
    }

    Search(value) {
        this.p = 1;
        this.userListData = this.userListData.filter((data) => {
            if (data.loyltyProgram.programName.toLowerCase() == value.searchText.toLowerCase()
                || data.subject.name.toLowerCase() == value.searchText.toLowerCase()
                || data.subject.username.toLowerCase() == value.searchText.toLowerCase()
                || data.subject.email == value.searchText
            ) {
                return data;
            }

        })

    }
    reset() {
        this.p = 1;
        this.disabledButton = true;
        this.filter.get('searchText').setValue('');
        this.userListData = this.availableUserListData;
    }
}
