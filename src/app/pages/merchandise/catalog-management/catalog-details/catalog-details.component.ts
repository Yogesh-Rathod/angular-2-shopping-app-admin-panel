import { Component, OnInit } from '@angular/core';
declare let $: any;

import { CatalogManagementService } from 'app/services';

@Component({
    selector: 'app-catalog-details',
    templateUrl: './catalog-details.component.html',
    styleUrls: ['./catalog-details.component.scss']
})
export class BankDetailsComponent implements OnInit {

    bankId = 12233;
    bankInfo: any;
    banks: any;
    bigLoader: false;

    constructor(
        private catalogManagementService: CatalogManagementService
    ) { }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });

        this.getCatalog();
    }

    getCatalog() {
        const banks = this.catalogManagementService.getCatalogsList();
        this.bankInfo = banks[0];
    }

}
