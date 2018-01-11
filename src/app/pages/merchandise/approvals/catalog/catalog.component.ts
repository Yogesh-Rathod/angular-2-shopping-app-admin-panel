import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators,
    FormBuilder
} from "@angular/forms";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { CatalogManagementService } from 'app/services';

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

    showLoader = false;
    filteredApproveCatalogs: any;


    constructor(
        private catalogManagementService: CatalogManagementService,
        public toastr: ToastsManager,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.getCatalogsApproval();
    }

    getCatalogsApproval() {
        this.catalogManagementService.getCatalogsApprovalList().then(res => {
            console.log("res Approval ==>", res);
            this.filteredApproveCatalogs = res.Data;
        });
    }

    approveCatalog(_catalog) {
        this.catalogManagementService.approvePostCatalog(_catalog).then(res => {
            console.log("res Approval ==>", res);
            this.getCatalogsApproval();
        });
    }

}
