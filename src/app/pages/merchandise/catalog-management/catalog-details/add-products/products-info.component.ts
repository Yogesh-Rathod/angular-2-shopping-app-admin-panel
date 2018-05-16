import {
    Component,
    OnInit,
    Output,
    Input,
    EventEmitter,
    OnChanges
} from '@angular/core';
import {
    CatalogManagementService,
    ProductsService,
    VendorsService,
    JsonToExcelService
} from 'app/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogBulkUploadComponent } from 'app/pages/merchandise/catalog-management/bulk-upload/bulk-upload.component';

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
        text: 'Select',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: 'col-9 no_padding'
    };
    allMapTempProducts: any = [];
    catalogId: any;
    selectAllCheckbox = false;
    saveChangesLoader = false;
    atLeastOnePresent = false;
    pageSize: any;

    constructor(
        private jsonToExcelService: JsonToExcelService,
        private fb: FormBuilder,
        private toastr: ToastsManager,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private router: Router,
        private catalogManagementService: CatalogManagementService,
        private productsService: ProductsService,
        private vendorsService: VendorsService
    ) {
        this.route.params.subscribe(params => {
            this.catalogId = params['catalogId'];
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
            'e.sKU': [''],
            'e.parentProductCode': [''],
            'e.sellerId': [[]]
        });
    }

    // GET Seller List
    getSellerList() {
        this.vendorsService.getVendors().then(res => {
            if (res.Code == 200) {
                this.vendorsList = res.Data ? res.Data : [];
                this.vendorsList.map(i => {
                    i.itemName = i.Company;
                    i.id = i.SellerId;
                });
            }
        });
    }

    //GET products
    getAllProduct(_searchObj) {
        _.forEach(_searchObj, item => {
            if (item) {
                this.atLeastOnePresent = true;
            }
        });
        this.searchLoader = true;
        this.productsService.getMasterProducts(_searchObj).then(res => {
            if (res.Success) {
                this.allProducts = res.Data.Products ? res.Data.Products : [];
                this.pageSize = res.Data.TotalRecords;
            }
            this.searchLoader = false;
            this.allMapTempProducts = [];
            this.selectAllCheckbox = false;
        });
    }

    generateSearchFilters(_searchObject) {
        if (
            _searchObject['e.sellerId'] &&
            _searchObject['e.sellerId'].length > 0
        ) {
            if (typeof _searchObject['e.sellerId'][0] === 'object') {
                _searchObject['e.sellerId'] = _searchObject['e.sellerId'].map(
                    item => {
                        return item.SellerId;
                    }
                );
                _searchObject['e.sellerId'] = _searchObject['e.sellerId'].join(
                    ','
                );
            }
        }
        _searchObject = JSON.stringify(_searchObject);
        _searchObject = _searchObject
            .replace(/{|}|[\[\]]|/g, '')
            .replace(/":"/g, '=')
            .replace(/","/g, '&')
            .replace(/"/g, '');
        return _searchObject;
    }

    searchProductFormFunc(_searchData) {
        let searchData = this.generateSearchFilters(_searchData);
        this.getAllProduct(searchData);
    }

    removeFromMapProducts(item) {
        _.forEach(this.allMapTempProducts, product => {
            if (product) {
                if (item.ProductId === product.ProductId) {
                    _.forEach(this.allProducts, selectedItem => {
                        if (selectedItem.Id === item.ProductId) {
                            selectedItem.isChecked = !selectedItem.isChecked;
                            this.selectAllCheckbox = false;
                        }
                    });
                    _.remove(this.allMapTempProducts, product);
                }
            }
        });
    }

    //UI ADD
    mapProductToCatalog(_product) {
        this.allMapTempProducts = [];
        _.forEach(_product, item => {
            if (item.isChecked) {
                for (var i = 0; i < this.allMapTempProducts.length; i++) {
                    if (this.allMapTempProducts[i].ProductId == item.Id) {
                        return;
                    }
                }
                let tempObj = {
                    Id: item.Id,
                    Name: item.Name,
                    RetailPrice: item.RetailPrice,
                    RetailShippingPrice: item.RetailShippingPrice,
                    RetailPriceInclusive: item.RetailPriceInclusive,
                    DiscountType: item.DiscountType,
                    Discount: item.Discount,
                    CatalogProductMappingIsActive: item.CatalogProductMappingIsActive
                        ? item.CatalogProductMappingIsActive
                        : true,
                    IsFeaturedProduct: item.IsFeaturedProduct
                        ? item.IsFeaturedProduct
                        : false,
                    FeaturedProductDisplayOrder: 0,
                    IsHomePageProduct: item.IsHomePageProduct
                        ? item.IsHomePageProduct
                        : false,
                    HomePageProductDisplayOrder: 0
                };
                this.allMapTempProducts.push(tempObj);
            }
        });
    }

    ngOnChanges(changes) {}

    mapProductWithCatalog() {
        this.saveChangesLoader = true;
        let productsToMap = {
            CatalogId: this.catalogId,
            Products: this.allMapTempProducts
        };
        this.catalogManagementService
            .mapProductToCatalog(productsToMap)
            .then(res => {
                if (res.Success) {
                    this.toastr.success(
                        'Product mapped successfully.',
                        'Sucess!'
                    );
                    this.onStatusChange.emit(true);
                    this.allMapTempProducts = [];
                    this.saveChangesLoader = false;
                } else {
                    this.saveChangesLoader = false;
                    this.toastr.error('Something went wrong.', 'Error!');
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

    exportAllProducts() {
        this.searchLoader = true;
        let searchObj = this.generateSearchFilters(
            this.searchProductForm.value
        );
        this.productsService
            .getMasterProducts(searchObj, this.pageSize)
            .then(res => {
                if (res.Success) {
                    this.allProducts = res.Data.Products
                        ? res.Data.Products
                        : [];
                    this.jsonToExcelService.exportAsExcelFile(
                        this.allProducts,
                        'products'
                    );
                    // this.pageSize = res.Data.TotalRecords;
                }
                this.searchLoader = false;
                // this.allMapTempProducts = [];
                // this.selectAllCheckbox = false;
            });
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

    catalogBulkUpload() {
        const activeModal = this.modalService.open(CatalogBulkUploadComponent, {
            size: 'sm'
        });
        activeModal.componentInstance.catalogId = this.catalogId;
        activeModal.componentInstance.isApproval = false;

        activeModal.result
            .then(status => {
                if (status) {
                    this.onStatusChange.emit(true);
                }
            })
            .catch(status => {});
    }
}
