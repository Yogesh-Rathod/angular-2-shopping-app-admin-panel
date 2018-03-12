import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import {
    CatalogManagementService,
    ProductsService,
    VendorsService
} from "app/services";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";

@Component({
    selector: 'app-products-info',
    templateUrl: './products-info.component.html',
    styleUrls: ['./products-info.component.scss']
})
export class ProductsInfoComponent implements OnInit {

    @Input() notifier;
    @Output() onStatusChange = new EventEmitter<any>();

    catalogMapOpen = false;
    searchLoader = false;
    searchProductForm: FormGroup;
    vendorsList: any = [];
    allProducts: any = [];
    multiDropdownSettings = {
        singleSelection: false,
        text: "Select",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        enableSearchFilter: true,
        classes: "col-9 no_padding"
    };
    allMapTempProducts: any = [];
    catalogId: any;
    selectAllCheckbox = false;
    saveChangesLoader = false;
    atLeastOnePresent = false;

    constructor(
        private fb: FormBuilder,
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
        this.createSearchForm();
        this.getSellerList();
    }

    // Create Search Form
    createSearchForm() {
        this.searchProductForm = this.fb.group({
            'e.name': [''],
            'e.sellerId': [[]]
        });
    }

    // GET Seller List
    getSellerList() {
        this.vendorsService.getVendors().then(res => {
            if (res.Code == 200) {
                this.vendorsList = res.Data ? res.Data : [];
                this.vendorsList.map((i) => {
                    i.itemName = i.Company;
                    i.id = i.SellerId;
                });
            }
        });
    }

    //GET products , TODO: API need to changed with filter
    getAllProduct(_searchObj) {
        let newObj = _searchObj.split('&');
        _.forEach(newObj, (item) => {
            if (item) {
                this.atLeastOnePresent = true;
            }
        })
        this.searchLoader = true;
        this.productsService.getMasterProducts(_searchObj).then(res => {
            if (res.Success) {
                this.allProducts = res.Data.Products ? res.Data.Products : [];
                this.searchLoader = false;
            }
        });
    }

    searchProductFormFunc(_searchData) {
        if (_searchData['e.sellerId'] && _searchData['e.sellerId'].length > 0) {
            if (typeof _searchData['e.sellerId'][0] === 'object') {
                _searchData['e.sellerId'] = _searchData['e.sellerId'].map(item => {
                    return item.SellerId;
                });
                _searchData['e.sellerId'] = _searchData['e.sellerId'].join(',');
            }
        }
        _searchData = JSON.stringify(_searchData);
        _searchData = _searchData.replace(/{|}|[\[\]]|/g, '').replace(/":"/g, '=').replace(/","/g, '&').replace(/"/g, '');
        this.getAllProduct(_searchData);
    }

    //UI ADD
    mapProductToCatalog(_product) {
        _.forEach(_product, item => {
            if (item.isChecked) {
                for (var i = 0; i < this.allMapTempProducts.length; i++) {
                    if (this.allMapTempProducts[i].ProductId == item.Id) {
                        return;
                    }
                }
                let tempObj = {
                    CatalogId: this.catalogId,
                    ProductId: item.Id,
                    Name: item.Name,
                    RetailPrice: item.RetailPrice,
                    RetailShippingPrice: item.RetailShippingPrice,
                    RetailPriceInclusive: item.RetailPriceInclusive,
                    DiscountType: item.DiscountType,
                    Discount: item.Discount,
                    //          CatalogProductMappingIsActive:item.CatalogProductMappingIsActive,
                    CatalogProductMappingIsActive: true,
                    IsFeaturedProduct: item.IsFeaturedProduct,
                    FeaturedProductDisplayOrder: 0,
                    IsHomePageProduct: item.IsHomePageProduct,
                    HomePageProductDisplayOrde: 0
                };
                this.allMapTempProducts.push(tempObj);
            }
        });
    }

    ngOnChanges(changes) {
    }

    mapProductWithCatalog() {
        this.saveChangesLoader = true;
        let productsToMap = JSON.stringify(this.allMapTempProducts);
        this.catalogManagementService
            .mapProductToCatalog(this.catalogId, productsToMap)
            .then(res => {
                if (res.Success) {
                    this.toastr.success(
                        "Product mapped successfully.",
                        "Sucess!"
                    );
                    this.onStatusChange.emit(true);
                    // this.getMapProductForApproveFunc(this.catalogId);
                    this.allMapTempProducts = [];
                    this.saveChangesLoader = false;
                } else {
                    this.saveChangesLoader = false;
                    this.toastr.error(
                        "Something went wrong.",
                        "Error!"
                    );
                }
            });
    }

    selectAll(e) {
        if (e.target.checked) {
            this.selectAllCheckbox = true;
            _.forEach(this.allProducts, item => {
                item.isChecked = true;
            });
            // this.showSelectedDelete = true;
        } else {
            this.selectAllCheckbox = false;
            _.forEach(this.allProducts, item => {
                item.isChecked = false;
            });
            // this.showSelectedDelete = false;
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
                // this.showSelectedDelete = true;
                isCheckedArray.push(item);
            }
        });

        if (isCheckedArray.length === 0) {
            // this.showSelectedDelete = false;
        }
    }



}
