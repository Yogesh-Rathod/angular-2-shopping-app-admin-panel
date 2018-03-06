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

    programList: any = [];
    curentSelectedProgram: any = null;
    showMapprogram:boolean =false;
    programMappedList: any = [{ ProgramName:"LVB Bank" }];
    allMapProductsApprove: any = [];
    catalogInfo: any;
    for: any;
    catalogId: any;
    catalogMapOpen: boolean = false;
    bankId = 12233;
    bankInfo: any;
    banks: any;
    bigLoader: false;
    allMapProducts: any = [];
    searchProductForm: FormGroup;
    approveProductsLoader = false;
    productsLoader = false;

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
            this.getAllMappedProgram(this.catalogId);
            if (this.for == "map") {
                this.catalogMapOpen = true;
                this.getMapProductForApproveFunc(this.catalogId);
            }
        }
        this.getAllProgram();
    }

    getAllProgram() {
       this.catalogManagementService.getAllProgramList().then(res =>{
            if(res.Success){
                this.programList =res.Data;
            }
       })
    }

    getAllMappedProgram(_catalogId){
        this.catalogManagementService.getAllMappedProgramList(_catalogId).then(res =>{
            if(res.Success){
                this.programMappedList = res.Data;
            }
            else{
                this.programMappedList =[];
            }
        });
    }

    unMapProgram(_program) {
    }

    mapProgram(_program){
        let bodyObj = {
            CatalougeId: this.catalogId,
            ProgramId: _program.Id
        };
        this.catalogManagementService.mapCatalogProgram(bodyObj).then(res=>{
            if(res.Success){
                this.toastr.success(
                    "Program mapped with catalog successfully.",
                    "Sucess!"
                );
            }else{
                this.toastr.error(
                    res.Message,
                    "Error!"
                );
            }
        })
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

    getMapProductForApproveFunc(_catalogId) {
        this.catalogManagementService
            .getMapProductForApprove(_catalogId)
            .then(res => {
                if (res.Code == 200) {
                    this.allMapProductsApprove = res.Data?res.Data:[];
                }
            });
    }

    goBackFunc() {
        this.location.back();
    }

    //POST Approve Map
    approveProductMap(_reason) {
        this.approveProductsLoader = true;
        var approveObj = {
            Reason:_reason,
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
                    this.allMapProductsApprove=[];
                    this.getMapProductListByCatalog(this.catalogId);
                    this.approveProductsLoader = false;
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
