import { Injectable } from '@angular/core';
import { BaThemeSpinner } from 'app/theme/services/baThemeSpinner/baThemeSpinner.service';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from 'environments/environment';
import { CommonService } from 'lrshared_modules/services/common-services.service';
import { ResponseHandingService } from 'lrshared_modules/services/response-handling.service';

@Injectable()
export class MerchandiseService {

    constructor(
        private http: Http,
        private _spinner: BaThemeSpinner,
        private commSer: CommonService,
        private responseHandler: ResponseHandingService,
    ) { }

    init(): Promise<boolean> {
        this._spinner.show();
        return new Promise(
            (resolve, reject) => {
                resolve(true);
            }
        );
    }
}
