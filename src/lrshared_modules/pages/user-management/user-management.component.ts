import { Component, Input, OnInit } from '@angular/core';
import { AppStateManagementService } from 'lrshared_modules/services/app-state-management.service';
import { UserService } from 'lrshared_modules/pages/user-management/user.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/takeWhile';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
declare let $: any;

@Component({
    selector: 'user',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})

export class UserManagementComponent implements OnInit {

    userListData = [];
    filteredUserListData: any;
    filter: FormGroup;
    isLoading = {
        userList: true
    };

    constructor(
        public toastr: ToastsManager,
        private appStateManagementService: AppStateManagementService,
        private userService: UserService,
        public router: Router,
        private fb: FormBuilder,
    ) {
        this.userList();
    }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.filter = this.fb.group({
            searchText: ['']
        });
    }

    userList() {
        this.isLoading.userList = true;
        // this.isLoading.userList = false;
        this.userService.getAllUsers()
            .then((res) => {
                this.userListData = res.Data;
                this.filteredUserListData = this.userListData;
                console.log("this.userListData ", this.userListData);
                this.isLoading.userList = false;
            })
            .catch(rej => {
                    console.log("getAllUsers rej ", rej);
        //         this.isLoading.userList = false;
        //         this.toastr.error(rej.message);
            });
    }

    Search(value) {
        this.filteredUserListData = this.userListData.filter((item) => {
            const caseInsensitiveSearch = new RegExp(`${value.searchText.trim()}`, "i");
            return caseInsensitiveSearch.test(item.UserName) || caseInsensitiveSearch.test(item.EmailId) || caseInsensitiveSearch.test(item.Mobile);
        });
    }

}
