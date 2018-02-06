import { Injectable } from '@angular/core';
import { BaThemeSpinner } from 'app/theme/services/baThemeSpinner/baThemeSpinner.service';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from 'environments/environment';
import { ResponseHandingService } from 'users_modules/services/response-handling.service';

@Injectable()
export class MerchandiseService {

    constructor(
        private http: Http,
        private _spinner: BaThemeSpinner,
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
