import { Component, OnInit } from "@angular/core";
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
    selector: "app-catalog-details",
    templateUrl: "./catalog-details.component.html",
    styleUrls: ["./catalog-details.component.scss"]
})
export class BankDetailsComponent implements OnInit {
    allMapProductsApprove: any = [];
    vendorsList: any = [];
    allMapTempProducts: any = [];
    showSelectedDelete: boolean;
    catalogInfo: any;
    for: any;
    catalogId: any;
    catalogMapOpen: boolean = false;
    bankId = 12233;
    bankInfo: any;
    banks: any;
    bigLoader: false;
    allProducts: any = [];
    allProductsFiltered: any = [];
    allMapProducts: any = [];
    selectAllCheckbox = false;
    searchProductForm: FormGroup;
    multiDropdownSettings = {
        singleSelection: false,
        text: "Select",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        enableSearchFilter: true,
        classes: "col-9 no_padding"
    };

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
                this.getAllProgram();
                this.getMapProductForApproveFunc(this.catalogId);
            }
        }
        this.createSearchForm();
        this.getSellerList();
    }

    // Create Search Form
    createSearchForm() {
        this.searchProductForm = this.fb.group({
            searchText: [""],
            Vendors: [[]]
        });
    }
    searchProductFormFunc(_searchData) {
        this.getAllProduct(_searchData);
        console.log("_searchData== >", _searchData);
    }

    // GET Seller List
    getSellerList() {
        this.vendorsService.getVendors().then(res => {
            console.log("Vendors =========>>", res);
            if (res.Code == 200) {
                this.vendorsList = res.Data ? res.Data : [];
                this.vendorsList.map(function(i) {
                    i.itemName = i.FirstName;
                    i.id = i.SellerId;
                });
            }
        });
    }

    //GET products , TODO: API need to changed with filter
    getAllProduct(_searchObj) {
        this.productsService.getMasterProducts(_searchObj).then(res => {
            if (res.Success) {
                this.allProducts = res.Data.Products?res.Data.Products:[];
                this.allProductsFiltered = this.allProducts;
            }
        });
    }
    getAllProgram() {
        console.log("***************Call for all program *******************");
        return [];
    }

    //GET
    getCatalogDetails(_catalogId, _for) {
        this.catalogManagementService
            .getCatalogsById(_catalogId, _for)
            .then(res => {
                if (res.Code == 200) {
                    this.catalogInfo = res.Data;
                }
            });
    }

    //GET
    getMapProductListByCatalog(_catalogId) {
        this.catalogManagementService
            .getMapProductList(_catalogId)
            .then(res => {
                console.log("========**********+++++++++>>>", res);
                if (res.Code == 200) {
                    this.allMapProducts = res.Data;
                }
            });
    }
    getMapProductForApproveFunc(_catalogId) {
        this.catalogManagementService
            .getMapProductForApprove(_catalogId)
            .then(res => {
                console.log(
                    "getMapProductForApprove========**********+++++++++>>>",
                    res
                );
                if (res.Code == 200) {
                    this.allMapProductsApprove = res.Data;
                }
            });
    }

    goBackFunc() {
        this.location.back();
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
                    CatalogProductMappingIsActive:true,
                    IsFeaturedProduct: item.IsFeaturedProduct,
                    FeaturedProductDisplayOrder: 0,
                    IsHomePageProduct: item.IsHomePageProduct,
                    HomePageProductDisplayOrde: 0
                };
                this.allMapTempProducts.push(tempObj);
            }
        });
    }

    //POST
    mapProductWithCatalog() {
        let productsToMap = JSON.stringify(this.allMapTempProducts);
        this.catalogManagementService
            .mapProductToCatalog(this.catalogId, productsToMap)
            .then(res => {
                if (res.Success) {
                    this.toastr.success(
                        "Product mapped successfully.",
                        "Sucess!"
                    );
                    this.getMapProductForApproveFunc(this.catalogId);
                    this.allMapTempProducts = [];
                } else {
                    this.toastr.error(
                        "Something went wrong.",
                        "Error!",
                        "Error!"
                    );
                }
            });
    }

    //POST Approve Map
    approveProductMap(_product, _index) {
        this.catalogManagementService
            .approveProductPostCatalog(_product)
            .then(res => {
                console.log(res);
                if (res.Success) {
                    this.toastr.success(
                        "Catalog product map approved.",
                        "Sucess!"
                    );
                    this.allMapProductsApprove=[];
                    this.getMapProductListByCatalog(this.catalogId);
                } else {
                    this.toastr.error(
                        "Something went wrong.",
                        "Error!",
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
