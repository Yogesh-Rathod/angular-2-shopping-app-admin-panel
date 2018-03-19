import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { CatalogManagementService } from "app/services";
import { ToastsManager } from "ng2-toastr";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-program-map',
    templateUrl: './program-map.component.html',
    styleUrls: ['./program-map.component.scss']
})
export class ProgramMapComponent implements OnInit {

    @Input() notifier;
    @Output() onStatusChange = new EventEmitter<any>();

    catalogId: any;
    programMappedList: any = [];
    showMapprogram: boolean = false;
    curentSelectedProgram: any = null;
    programList: any = [];
    mapProgramLoader = false;

    constructor(
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
        this.getAllProgram();
        if (this.catalogId) {
            this.getAllMappedProgram(this.catalogId);
        }
    }

    getAllProgram() {
        this.catalogManagementService.getAllProgramList().then(res => {
            if (res.Success) {
                this.programList = res.Data;
            }
        })
    }

    getAllMappedProgram(_catalogId) {
        this.catalogManagementService.getAllMappedProgramList(_catalogId).then(res => {
            if (res.Success) {
                this.programMappedList = res.Data;
            }
            else {
                this.programMappedList = [];
            }
        });
    }

    mapProgram(_program) {
        this.mapProgramLoader = true;
        let bodyObj = {
            CatalougeId: this.catalogId,
            ProgramId: _program.Id
        };
        console.log("bodyObj ", bodyObj);
        this.catalogManagementService.mapCatalogProgram(bodyObj).then(res => {
            if (res.Success) {
                this.toastr.success(
                    "Program mapped with catalog successfully.",
                    "Sucess!"
                );
            } else {
                this.toastr.error(
                    res.Message,
                    "Error!"
                );
            }
            this.mapProgramLoader = false;
        }).catch((error) => {
            this.mapProgramLoader = false;
        })
    }

    unMapProgram(_program) {
    }

}
