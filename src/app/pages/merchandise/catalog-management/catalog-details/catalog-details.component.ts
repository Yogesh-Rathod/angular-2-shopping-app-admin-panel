import { Component, OnInit } from "@angular/core";
declare let $: any;

import {
    CatalogManagementService,
    MerchandiseService,
    ProductsService
} from "app/services";
import { Location } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";

@Component({
    selector: "app-catalog-details",
    templateUrl: "./catalog-details.component.html",
    styleUrls: ["./catalog-details.component.scss"]
})
export class BankDetailsComponent implements OnInit {
    showSelectedDelete: boolean;
    catalogInfo: any;
    for: any;
    catalogId: any;
    catalogMapOpen: boolean = false;
    bankId = 12233;
    bankInfo: any;
    banks: any;
    bigLoader: false;
    allProducts:any;
    allProductsFiltered:any;
    selectAllCheckbox = false;

    constructor(
        private location: Location,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private merchandiseService: MerchandiseService,
        private toastr: ToastsManager,
        private route: ActivatedRoute,
        private router: Router,
        private catalogManagementService: CatalogManagementService,
        private productsService: ProductsService
    ) {
        this.route.params.subscribe(params => {
            this.catalogId = params["catalogId"];
            this.for = params["for"];
        });
    }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });

        if (this.catalogId) {
            this.getCatalogDetails(this.catalogId, this.for);
            this.getMapProductListByCatalog(this.catalogId);
            if (this.for == "map") {
                this.catalogMapOpen = true;
                this.getAllProduct();
                this.getAllProgram();
            }
        }
    }

    getAllProduct() {
        console.log("***************Call for all product *******************");
        this.productsService.getProducts().then(res => {
            console.log("res all product", res);
            this.allProducts = res.Data;
            this.allProductsFiltered = this.allProducts;
        });
    }
    getAllProgram() {
        console.log("***************Call for all program *******************");
        return [];
    }

    getCatalogDetails(_catalogId, _for) {
        this.catalogManagementService
            .getCatalogsById(_catalogId, _for)
            .then(res => {
                this.catalogInfo = res.Data;
            });
    }
    getMapProductListByCatalog(_catalogId) {
        this.catalogManagementService
            .getMapProductList(_catalogId)
            .then(res => {
                console.log("getMapProductListByCatalog ==========>>", res);
            });
    }

    goBackFunc() {
        this.location.back();
    }

    selectAll(e) {
        if (e.target.checked) {
            this.selectAllCheckbox = true;
            _.forEach(this.allProducts, item => {
                item.isChecked = true;
            });
            this.showSelectedDelete = true;
        } else {
            this.selectAllCheckbox = false;
            _.forEach(this.allProducts, item => {
                item.isChecked = false;
            });
            this.showSelectedDelete = false;
        }
    }

    checkBoxSelected(e, item) {
        this.selectAllCheckbox = false;
        if (e.target.checked) {
            item.isChecked = true;
        } else {
            item.isChecked = false;
        }

        let isCheckedArray = [];

        _.forEach(this.allProducts, item => {
            if (item.isChecked) {
                this.showSelectedDelete = true;
                isCheckedArray.push(item);
            }
        });

        if (isCheckedArray.length === 0) {
            this.showSelectedDelete = false;
        }
    }
}
