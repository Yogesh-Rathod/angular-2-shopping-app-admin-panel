import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { CommonService } from 'lrshared_modules/services/common-services.service';
import { FormControl, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'lrshared_modules/pages/user-management/user.service';
import { AppStateManagementService } from 'lrshared_modules/services/app-state-management.service';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/takeWhile';
import { AppState } from 'app/app.service';

@Component({
    templateUrl: './addEditAuthority.component.html',
    styleUrls: ['./addEditAuthority.component.scss'],
})

export class AddEditAuthorityComponent implements OnInit, OnDestroy {
    applicationName: string;
    selectedProgram: any;
    selectedPrograms = [];
    globalInfo: any;
    availableUserRoles: any;
    selectedRoles = [];
    authority: FormGroup;
    programList = [];
    assignedRoles = [];
    disabledButton = true;
    programName = '';
    userId = '';
    id = '';
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
        text: 'Select Programs',
        disabled: false
    };

    roles = {
        'roles': [],
    };
    isLoading = {
        authority: true
    };
    alive: boolean = true;

    constructor(
        private userService: UserService,
        private commonService: CommonService,
        private route: ActivatedRoute,
        public toastr: ToastsManager,
        private activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private appStateManagementService: AppStateManagementService,
        private globals: AppState,
    ) {
    }

    ngOnInit() {
        this.programOptionSettings.disabled = environment.appName === 'RETAIL';

        this.programList = JSON.parse(localStorage.getItem('applicablePrograms'));
        
        if (this.programName) {
            this.selectedProgram = this.programName;
        }
        this.setPrograms();
        this.getApplicationData();
        this.createForm();
        this.fetchRoles();
    }

    ngOnDestroy() {
        this.alive = false;
    }

    createForm() {
        this.authority = this.fb.group({
            role: ['', [Validators.required]],
            program: ['', [Validators.required]]
        });
    }

    setPrograms() {
        this.programList = this.programList.map(program => {
            program.itemName = program.programName;
            return program;
        });
        if(this.selectedProgram) {
            this.selectedPrograms = [{
                id: this.selectedProgram.id,
                itemName: this.selectedProgram.programName,
                programId: this.selectedProgram.programId
            }];
        } else {
            this.selectedPrograms = [];
        }
    }

    fetchRoles() {
        this.userService.fetchRoles()
            .then((res) => {
                this.availableUserRoles = res.payload.map(item => {
                    item.itemName = item.role;
                    return item;
                });

                this.selectedRoles = this.assignedRoles.map(data => {
                    data.itemName = data.role;
                    return data;
                });
            })
            .catch(rej => { });
    }

    addRole(authority) {
        this.isLoading.authority = false;
        this.disabledButton = false;
        this.roles.roles = authority.role.map(data => {
            return data.id;
        });
        console.log(this.roles.roles);
        if (this.roles.roles) {
            this.userService.getUnrestrictedUser(this.userId)
                .then((res) => {
                    let i = 0;
                    for (const selectedProgram of authority.program) {
                        const assignProgramRequestData = {
                            user: res.payload,
                            program: selectedProgram,
                            role: authority.role,
                            application: this.globalInfo[0]
                        };

                        this.userService.assignProgramUser(
                            JSON.stringify(assignProgramRequestData),
                            this.userId,
                            selectedProgram.id,
                            this.globalInfo[0].id
                        )
                            .then((assignProgramUserRes) => {
                                this.toastr.success(assignProgramUserRes.message);
                                this.assignRole(assignProgramUserRes.payload.id, selectedProgram, i === authority.program.length - 1);
                                ++i;
                            })
                            .catch(rej => {
                                if (rej.statusCode === 409) {
                                    this.fetchUser({
                                        userId: this.userId,
                                        program: selectedProgram,
                                        applicationId: this.globalInfo[0].id
                                    }, i === authority.program.length - 1);
                                    ++i;
                                }
                                console.log(rej);
                            });
                    }
                })
                .catch(rej => { });
        }
    }

    fetchUser(upa, isLast) {
        this.userService.getUPA(upa)
            .then((res) => {
                this.assignRole(res.payload.id, upa.program, isLast);
            })
            .catch(rej => {
                console.log(rej);
            });
    }

    assignRole(userId, program, isLast) {
        this.userService.assignRole(JSON.stringify(this.roles), userId, program)
            .then((res) => {
                this.isLoading.authority = true;
                this.toastr.success('Role has been assigned');
                if (isLast) {
                    this.closeModal(true);
                }
            })
            .catch(rej => { this.isLoading.authority = true; });
    }

    getApplicationData() {
        this.globalInfo = this.globals.get('applicationData');
        this.applicationName = environment.appName;
    }

    closeModal(data) {
        this.activeModal.close(data);
    }
}
