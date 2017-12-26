/**
 * @author Arti Kumari
 * @email arti.kumari@loylty.in
 * @create date 2017-09-07
 * @modify date 2017-09-07
 * @desc [description]
*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from 'environments/environment';
import { AppState } from 'app/app.service';
import { CookieService } from 'ngx-cookie';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { CommonService } from 'lrshared_modules/services/common-services.service';
import { ResponseHandingService } from 'lrshared_modules/services/response-handling.service';

@Injectable()
export class UserService {

        headers = new Headers({
                'headers': '',
                'Authorization': `Bearer ${'someToken'}`,
                'LRSignAuth': 'lvbportal:1:1:1',
                'ModuleId': '5eaf0cad-e3b4-11e7-8376-00155d0a0867',
                'Content-Type': 'application/json',
                'Accept': 'q=0.8;application/json;q=0.9'
        });
        options = new RequestOptions({ headers: this.headers });

        constructor(
                private http: Http,
                private commSer: CommonService,
                private responseHandler: ResponseHandingService,
        ) {
        }

        userData(): Promise<any> {
                const url = `${environment.rbacUrl}/resolvedUsersByProgramAndApplication`;

                const header = new Headers();
                // this.commSer.createAuthorizationHeader(header);
                // header.append('XServiceName', `resolvedusersbyprogramandapplication`);
                // const data = {
                //         'programIdentifier': this.commSer.getCurrentProgram()['programId'],
                //         'applicationLiteral': environment.appName
                // };
                const options = new RequestOptions({ headers: header });

                return this.http.post(url, JSON.stringify('data'), options)
                        .timeout(environment.timeOut)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        getAllUsers() {
                const url = `${environment.rbacUrl}/resolvedUsersByApplication`;

                const header = new Headers();
                this.commSer.createAuthorizationHeader(header,true);
                header.append('XServiceName', `allResolvedUsersByApplication`);
                const options = new RequestOptions({ headers: header });

                return this.http.post(url, '', options)
                        .timeout(environment.timeOut)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        addUser(data): Promise<any> {
                const url = `${environment.rbacUrl}/Profile`;

                // const header = new Headers();
                // this.commSer.createAuthorizationHeader(header);
                // header.append('XServiceName', `adduser`);
                // const options = new RequestOptions({ headers: header });

                return this.http.post(url, data, this.options)
                        .timeout(environment.timeOut)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        assignProgramUser(data, userId, programId, appId): Promise<any> {
                const url = `${environment.rbacUrl}/program/${programId}/application/${appId}/user/${userId}`;

                const header = new Headers();
                this.commSer.createAuthorizationHeader(header);
                header.append('XServiceName', `createresolveduser`);
                const options = new RequestOptions({ headers: header });

                return this.http.post(url, data, options)
                        .timeout(environment.timeOut)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => {
                                if (err.status === 409) {
                                        const parseError = JSON.parse(err._body);
                                        parseError['statusCode'] = 409;
                                        return Promise.reject(parseError);
                                }

                                try {
                                        return Promise.reject(JSON.parse(err._body) || err);
                                } catch (ex) {
                                        return Promise.reject(err);
                                }
                        });
        }

        fetchSingleUser(id): Promise<any> {
                const url = `${environment.rbacUrl}/Profile/${id}`;

                // const header = new Headers();
                // this.commSer.createAuthorizationHeader(header, environment.appName === 'CRM');
                // header.append('XServiceName', `resolvedUsersByApplication`);
                // const options = new RequestOptions({ headers: header });

                return this.http.get(url, this.options)
                        .timeout(environment.timeOut)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        getUnrestrictedUser(id): Promise<any> {
                const url = `${environment.rbacUrl}/unrestricted/user/byId/${id}`;

                const header = new Headers();
                this.commSer.createAuthorizationHeader(header, environment.appName === 'CRM');
                header.append('XServiceName', `resolvedUsersByApplication`);
                const options = new RequestOptions({ headers: header });

                return this.http.get(url, options)
                        .timeout(environment.timeOut)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        updateUser(data, username): Promise<any> {
                const url = `${environment.rbacUrl}/user/${username}/`;

                const header = new Headers();
                this.commSer.createAuthorizationHeader(header);
                header.append('XServiceName', `updateuser`);
                const options = new RequestOptions({ headers: header });

                return this.http.patch(url, data, options)
                        .timeout(environment.timeOut)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        assignRole(roleId, userId, program): Promise<any> {
                const url = `${environment.rbacUrl}/resolvedUser/${userId}/`;

                const header = new Headers();
                this.commSer.createAuthorizationHeader(header);
                header.set('XProgramIds', program.programId);
                header.append('XServiceName', `assignrolestoresolveduser`);
                const options = new RequestOptions({ headers: header });

                return this.http.put(url, roleId, options)
                        .timeout(environment.timeOut)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        addAgent(data): Promise<any> {
                const url = `${environment.crmUrl}/agent`;

                const header = new Headers();
                this.commSer.createAuthorizationHeader(header);
                header.append('XServiceName', `createAgent`);
                const options = new RequestOptions({ headers: header });

                return this.http.post(url, data, options)
                        .timeout(environment.timeOut)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        assignAgentProgram(agentId, programId): Promise<any> {
                const url = `${environment.crmUrl}/agent/${agentId}/program/${programId}`;

                const header = new Headers();
                this.commSer.createAuthorizationHeader(header);
                header.append('XServiceName', `assignProgramToAgent`);
                const options = new RequestOptions({ headers: header });

                return this.http.post(url, '', options)
                        .timeout(environment.timeOut)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        getAgents(programId): Promise<any> {
                const url = `${environment.crmUrl}/program/${programId}/agents`;

                const header = new Headers();
                this.commSer.createAuthorizationHeader(header);
                header.append('XServiceName', `getAllAgents`);
                const options = new RequestOptions({ headers: header });

                return this.http.get(url, options)
                        .timeout(environment.timeOut)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        getApplicationInfo() {
                const url = `${environment.rbacUrl}/applications`;

                const header = new Headers();
                this.commSer.createAuthorizationHeader(header, true);
                header.append('XServiceName', `fetchapplications`);
                const options = new RequestOptions({ headers: header });

                return this.http.get(url, options)
                        .timeout(environment.timeOut)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        getUserInfo(userName) {
                const url = `${environment.rbacUrl}/user/${userName}`;
                const header = new Headers();
                this.commSer.createAuthorizationHeader(header);
                header.append('XServiceName', `getUserByEmail`);
                const options = new RequestOptions({ headers: header });
                return this.http.get(url, options)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        fetchRoles() {
                const url = `${environment.rbacUrl}/Role/All`;
                // const header = new Headers();
                // this.commSer.createAuthorizationHeader(header);
                // header.append('XServiceName', `overview`);
                // const options = new RequestOptions({ headers: header });
                return this.http.get(url, this.options)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

      fetchModules() {
                const url = `${environment.rbacUrl}/Module/All`;
                // const header = new Headers();
                // this.commSer.createAuthorizationHeader(header);
                // header.append('XServiceName', `overview`);
                // const options = new RequestOptions({ headers: header });
                return this.http.get(url, this.options)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        userByUserId(userId) {
                const url = `${environment.rbacUrl}/user/byId/${userId}`;
                const header = new Headers();
                this.commSer.createAuthorizationHeader(header);
                header.append('XServiceName', `overview`);
                header.set(`XApplicationLiteral`, `RETAIL`);
                const options = new RequestOptions({ headers: header });
                return this.http.get(url, options)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }

        getUPA(upa) {
                const url = `${environment.rbacUrl}/program/${upa.program.id}/application/${upa.applicationId}/user/${upa.userId}`;
                const header = new Headers();
                this.commSer.createAuthorizationHeader(header);
                header.append('XServiceName', `getUserByIdUnrestricted`);
                header.set('xProgramIds', upa.program.programId);
                const options = new RequestOptions({ headers: header });
                return this.http.get(url, options)
                        .toPromise()
                        .then(this.responseHandler.handleResponse)
                        .catch((err) => this.responseHandler.handleError(err));
        }
}
