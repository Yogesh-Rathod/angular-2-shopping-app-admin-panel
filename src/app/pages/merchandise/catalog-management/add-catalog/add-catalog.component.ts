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
    deleteLoader = false;
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
            });
    }

    genarateRandomID(_length = 32) {
        var text = "";
        var possible =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < _length; i++)
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        return text;
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

    addCatalog(addCatalogForm) {
        var isEdit = addCatalogForm.Id ? true : false;
        this.catalogManagementService
            .addNewCatalogs(addCatalogForm)
            .then(res => {
                console.log("Add res", res);
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
                    this.location.back();
                } else {
                    this.toastr.error("Something went wrong.", "Error!");
                }
            });
    }
    goBackFunc() {
        this.location.back();
    }
    deleteCatalog() {}
}
