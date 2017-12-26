import { Injectable } from '@angular/core';
import { BaThemeSpinner } from 'app/theme/services/baThemeSpinner/baThemeSpinner.service';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from 'environments/environment';
import { CommonService } from 'lrshared_modules/services/common-services.service';
import { ResponseHandingService } from 'lrshared_modules/services/response-handling.service';
import { GlobalState } from 'app/global.state';
import { AppState } from 'app/app.service';

@Injectable()
export class CrmService {

    createAgent = true;
    loginData;

    constructor(
        private http: Http,
        private _spinner: BaThemeSpinner,
        private commSer: CommonService,
        private responseHandler: ResponseHandingService,
        private globals: AppState,
        private _state: GlobalState
    ) { }

    init(loginData, username): Promise<{}> {
        this.loginData = loginData;
        if (this.createAgent) {
            this._spinner.show();

            const url = `${environment.crmUrl}/agent`;

            const header = new Headers();
            this.commSer.createAuthorizationHeader(header);
            header.set('Authorization', `Bearer ${loginData.token.tokenString}`);
            header.set('XProgramIds', `${this.getSelectedProgram(this.loginData)}`);
            header.append('XServiceName', `createAgent`);
            const options = new RequestOptions({ headers: header });

            return this.http.post(url, {
                email: username,
                name: username
            }, options)
                .timeout(environment.timeOut)
                .toPromise()
                .then(() => {
                    this.getCategories();
                    return this.responseHandler.handleResponse;
                })
                .catch((err) => {
                    return this.getCategories()
                    // return this.responseHandler.handleError(err)
                });
        } else {
            return new Promise(
                (resolve, reject) => {
                    resolve();
                }
            );
        }
    }

    getCategories() {
        const url = `${environment.crmUrl}/ticket/categories`;
        const header = new Headers();
        this.commSer.createAuthorizationHeader(header);
        header.set('Authorization', `Bearer ${this.loginData.token.tokenString}`);
        header.set('XProgramIds', `${this.getSelectedProgram(this.loginData)}`);
        header.append('XServiceName', `listMaster`);
        const options = new RequestOptions({ headers: header });

        return this.http.get(url, options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .then((res) => {
                this.getAgents();
                this.globals.set('categories', res.payload);
                this._state.notifyDataChanged('masters.categories', res.payload);
            })
            .catch((err) => {
                this.getAgents()
                return this.responseHandler.handleError(err)
            });
    }

    getAgents() {
        const url = `${environment.crmUrl}/agents/`;
        const header = new Headers();
        this.commSer.createAuthorizationHeader(header);
        header.set('Authorization', `Bearer ${this.loginData.token.tokenString}`);
        header.set('XProgramIds', `${this.getSelectedProgram(this.loginData)}`);
        header.append('XServiceName', `getAllAgents`);
        const options = new RequestOptions({ headers: header });

        return this.http.get(url, options)
            .timeout(environment.timeOut)
            .toPromise()
            .then(this.responseHandler.handleResponse)
            .catch((err) => this.responseHandler.handleError(err));
    }

    getSelectedProgram(loginData) {
        try {
            let programIds = '';
            this.loginData.applicablePrograms.forEach((programId) => {
                programIds += `${programId['programId']},`;
            });
            return programIds.slice(0, -1);
        } catch (ex) {
            console.log(ex)
        }
    }
}