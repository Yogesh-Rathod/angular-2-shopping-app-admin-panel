import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
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
declare let $: any;

@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {

    @Input() notifier;
    @Output() onStatusChange = new EventEmitter<any>();

    catalogId: any;
    productsLoader = false;
    allMapProducts: any = [];

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
            this.getMapProductListByCatalog(this.catalogId);
        }
    }

    ngOnChanges(changes) {
        this.getMapProductListByCatalog(this.catalogId);
    }

    getMapProductListByCatalog(_catalogId) {
        this.productsLoader = true;
        this.catalogManagementService
            .getMapProductList(_catalogId)
            .then(res => {
                if (res.Code == 200) {
                    this.allMapProducts = res.Data;
                    this.productsLoader = false;
                }
            });
    }

}
