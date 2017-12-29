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
import * as CryptoJS from "crypto-js";
import * as utf8 from 'utf8';

@Injectable()
export class UserService {

        constructor(
                private cookieService: CookieService,
                private http: Http,
                private commSer: CommonService,
                private responseHandler: ResponseHandingService,
        ) {
        }

        authToken = JSON.parse(this.cookieService.get('MERCHANDISE.token'));

        headers = new Headers({
                'headers': '',
                'Authorization': `Bearer ${this.authToken.accessToken}`,
                'ModuleId': environment.moduleId,
                'Content-Type': 'application/json',
                'Accept': 'q=0.8;application/json;q=0.9'
        });
        options = new RequestOptions({ headers: this.headers });


        createHMACSignature(requestMethod, requestURL, body = '') {
                let requestUrl = encodeURIComponent(requestURL).toLowerCase(),
                        timestamp = + new Date(),
                        nounce = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(8)),
                        signatureRaw = `${environment.hmacCliendId}${requestMethod}${requestUrl}${timestamp}${nounce}`;

                if (body) {
                        const contentString = JSON.stringify(body),
                        updatedContent = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(utf8.encode(contentString)));
                        signatureRaw = signatureRaw + updatedContent;
                }
                // Secret Will Be Updated Later On
                const clientSecret = utf8.encode(environment.hmacClientSecret);
                const finalSignature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(utf8.encode(signatureRaw), clientSecret));

                console.log("finalSignature ", `lvbportal:${finalSignature}:${nounce}:${timestamp}`);
                return `${environment.hmacCliendId}:${finalSignature}:${nounce}:${timestamp}`;
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
                const url = `${environment.rbacUrl}Profile`;
                this.headers.set('LRSignAuth', this.createHMACSignature('POST', url, data));
                return this.http.post(url, JSON.stringify(data), this.options)
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

        fetchSingleUser(id?: String): Promise<any> {
                let url = id ? `${environment.rbacUrl}Profile/${id}` : `${environment.rbacUrl}Profile`;
                this.headers.set('LRSignAuth', this.createHMACSignature('GET', url));

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

        updateUser(data): Promise<any> {
                const url = `${environment.rbacUrl}Profile`;
                this.headers.set('LRSignAuth', this.createHMACSignature('PUT', url, data));
                return this.http.put(url, JSON.stringify(data), this.options)
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
                const url = `${environment.rbacUrl}Role/All`;
                this.headers.set('LRSignAuth', this.createHMACSignature('GET', url));
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
