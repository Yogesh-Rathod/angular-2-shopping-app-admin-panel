import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { CatalogManagementService, JsonToExcelService } from "app/services";
import { ToastsManager } from "ng2-toastr";
import { ActivatedRoute, Router } from "@angular/router";

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
        private jsonToExcelService: JsonToExcelService,
        private toastr: ToastsManager,
        private route: ActivatedRoute,
        private router: Router,
        private catalogManagementService: CatalogManagementService
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

    exportAllProducts() {
        this.jsonToExcelService.exportAsExcelFile(this.allMapProducts, 'catalog_products');
    }

}
