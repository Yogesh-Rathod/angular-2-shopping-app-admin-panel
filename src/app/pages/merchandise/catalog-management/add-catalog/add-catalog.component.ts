import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";
import { Location } from "@angular/common";

import { MerchandiseService } from "app/services";
import { CatalogManagementService } from "app/services";

@Component({
    selector: "app-add-catalog",
    templateUrl: "./add-catalog.component.html",
    styleUrls: ["./add-catalog.component.scss"]
})
export class AddCatalogComponent implements OnInit {

    forApprove: any;
    catalogId: any;
    catalogInfo: any;
    showLoader = false;
    addCatalogForm: FormGroup;
    multiDropdownSettings = {
        singleSelection: false,
        text: "Select",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        enableSearchFilter: true,
        classes: "col-9 no_padding"
    };
    vendors = [
        {
            id: 1,
            itemName: "Venndor 1"
        },
        {
            id: 2,
            itemName: "Venndor 2"
        }
    ];
    programs = [
        {
            id: 1,
            itemName: "Program 1"
        },
        {
            id: 2,
            itemName: "Program 2"
        }
    ];
    bigLoader = false;
    enableProductSyncCheckbox = false;

    constructor(
        private location: Location,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private merchandiseService: MerchandiseService,
        private toastr: ToastsManager,
        private route: ActivatedRoute,
        private router: Router,
        private catalogManagementService: CatalogManagementService
    ) {
        this.route.params.subscribe(params => {
            this.catalogId = params["catalogId"];
            this.forApprove = params["for"];
        });
    }

    ngOnInit() {
        this.createForm();
        if (this.catalogId) {
            this.getCatalogDetails(this.catalogId, this.forApprove);
        }
    }

    getCatalogDetails(_catalogId, _for) {
        this.bigLoader = true;
        this.catalogManagementService
            .getCatalogsById(_catalogId, _for)
            .then(res => {
                this.catalogInfo = res.Data;

                this.addCatalogForm.controls["Id"].setValue(
                    _for == "approve"
                    ? this.catalogInfo.Id
                    : this.catalogInfo.Approval_CatalogId
                );
                this.addCatalogForm.controls["Name"].setValue(
                    this.catalogInfo.Name
                );
                this.addCatalogForm.controls["Description"].setValue(
                    this.catalogInfo.Description
                );
                this.addCatalogForm.controls["CatalogIsActive"].setValue(
                    _for == "approve"
                        ? this.catalogInfo.CatalogIsActive
                        : this.catalogInfo.IsActive
                );
                this.addCatalogForm.controls["EnableAllProducts"].setValue(
                    this.catalogInfo.EnableAllProducts
                );
                this.addCatalogForm.controls["EnableAutoProductSync"].setValue(
                    this.catalogInfo.EnableAutoProductSync
                );
                this.bigLoader = false;
            });
    }

    createForm() {
        this.addCatalogForm = this.fb.group({
            Id: [null],
            Name: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(100)
                ])
            ],
            Description: [""],
            Vendors: [[]],
            Programs: [[]],
            CatalogIsActive: [true, Validators.required],
            EnableAllProducts: [true],
            EnableAutoProductSync: [true]
        });
    }

    enableAllCheckBoxSelected(event) {
        console.log("event ", event.target.checked);
        if (event.target.checked) {
            this.enableProductSyncCheckbox = false;
        } else {
            this.enableProductSyncCheckbox = true;
            this.addCatalogForm.controls['EnableAutoProductSync'].setValue(null);
        }
    }

    addCatalog(addCatalogForm) {
        this.showLoader = true;
        var isEdit = addCatalogForm.Id ? true : false;
        this.catalogManagementService
            .addNewCatalogs(addCatalogForm)
            .then(res => {
                if ((res.Code = 200)) {
                    if (isEdit) {
                        this.toastr.success(
                            "Catalog updated. sent for approval process.",
                            "Sucess!"
                        );
                    } else {
                        this.toastr.success("Added Catalog sent for approval process.",
                            "Sucess!"
                        );
                    }
                    this.showLoader = false;
                    this.location.back();
                } else {
                    this.showLoader = false;
                    this.toastr.error("Something went wrong.", "Error!");
                }
            });
    }
    goBackFunc() {
        this.location.back();
    }
    deleteCatalog() {}
}
