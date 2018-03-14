import { Component, OnInit } from "@angular/core";
declare let $: any;

import { CatalogManagementService } from "app/services";
import { Location } from "@angular/common";
import { ToastsManager } from "ng2-toastr";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-catalog-details",
    templateUrl: "./catalog-details.component.html",
    styleUrls: ["./catalog-details.component.scss"]
})
export class BankDetailsComponent implements OnInit {

    catalogInfo: any;
    for: any;
    catalogId: any;
    catalogMapOpen: boolean = false;
    notifier = 1;
    bigLoader = false;

    constructor(
        private location: Location,
        private toastr: ToastsManager,
        private route: ActivatedRoute,
        private router: Router,
        private catalogManagementService: CatalogManagementService
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
            if (this.for == "map") {
                this.catalogMapOpen = true;
            }
        }
    }

    //GET
    getCatalogDetails(_catalogId, _for) {
        this.bigLoader = true;
        this.catalogManagementService
            .getCatalogsById(_catalogId, _for)
            .then(res => {
                if (res.Code == 200) {
                    this.catalogInfo = res.Data;
                }
                this.bigLoader = false;
            });
    }

    childStatusChanged(finished: boolean) {
        ++this.notifier;
    }

    goBackFunc() {
        this.location.back();
    }

}
