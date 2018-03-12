import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
declare let $: any;

import {
    CatalogManagementService,
    MerchandiseService,
    ProductsService,
    VendorsService
} from "app/services";
import { Location } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";

@Component({
    selector: 'app-vendors-info',
    templateUrl: './vendors-info.component.html',
    styleUrls: ['./vendors-info.component.scss']
})
export class VendorsInfoComponent implements OnInit {

    @Input() notifier;
    @Output() onStatusChange = new EventEmitter<any>();

    catalogMapOpen = false;
    approveProductsLoader = false;
    catalogId: any;
    allMapProductsApprove: any = [];
    productsLoader = false;
    commentDesc: any = '';

    constructor(
        private location: Location,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private merchandiseService: MerchandiseService,
        private toastr: ToastsManager,
        private route: ActivatedRoute,
        private router: Router,
        private catalogManagementService: CatalogManagementService,
        private productsService: ProductsService,
        private vendorsService: VendorsService
    ) {
        this.route.params.subscribe(params => {
            this.catalogId = params["catalogId"];
        });
    }

    ngOnInit() {
        if (this.catalogId) {
            this.getMapProductForApproveFunc(this.catalogId);
        }
    }

    ngOnChanges(changes) {
        this.getMapProductForApproveFunc(this.catalogId);
    }

    getMapProductForApproveFunc(_catalogId) {
        this.catalogManagementService
            .getMapProductForApprove(_catalogId)
            .then(res => {
                if (res.Code == 200) {
                    this.allMapProductsApprove = res.Data ? res.Data : [];
                }
            });
    }

    //POST Approve Map
    approveProductMap(_reason) {
        this.approveProductsLoader = true;
        var approveObj = {
            Reason: _reason,
            CatalogId: this.catalogId
        }
        this.catalogManagementService
            .approveProductPostCatalog(approveObj)
            .then(res => {
                if (res.Success) {
                    this.toastr.success(
                        "Catalog product map approved.",
                        "Sucess!"
                    );
                    this.onStatusChange.emit(true);
                    this.allMapProductsApprove = [];
                    this.approveProductsLoader = false;
                    this.commentDesc = '';
                } else {
                    this.approveProductsLoader = false;
                    this.toastr.error(
                        "Something went wrong.",
                        "Error!",
                        "Error!"
                    );
                }
            });
    }

}
