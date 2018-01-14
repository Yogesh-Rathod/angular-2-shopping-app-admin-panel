import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { environment } from 'environments/environment';
import { AppStateManagementService } from './app-state-management.service';
import { ResponseHandingService } from './response-handling.service';
import { CookieService } from 'ngx-cookie';
import { AppState } from 'app/app.service';

@Injectable()
export class CommonService {

  private token;
  private selectedProgram;
  private headers = new Headers();

  constructor(
    private _cookieService: CookieService,
    private http: Http,
    private appStateManagementService: AppStateManagementService,
    private responseHandlingService: ResponseHandingService,
    private globals: AppState,
  ) {
    this.appStateManagementService.retrieveAppStateCK$(`${environment.appName}.token`)
      .subscribe(
      cookieValue => {
        this.token = JSON.parse(cookieValue);
      },
      reason => console.log(reason)
      );

    this.appStateManagementService.retrieveAppStateLS$('selectedProgram')
      .subscribe(
      selectedProgram => {
        this.selectedProgram = selectedProgram ? JSON.parse(selectedProgram) : null;
      },
    );
  }

  getTreeNode(programId): Promise<any> {
    const url = `${environment.rbacUrl}/rbacui/retailUIItem/program/${programId}/TreeNode`;

    this.headers.set('XApplicationLiteral', environment.appName);
    this.headers.set('XProgramIds', programId);
    this.headers.set('Authorization', `Bearer ${this.token.tokenString}`);
    const options = new RequestOptions({ headers: this.headers });

    return this.http.get(url, options)
      .toPromise()
      .then(response => this.responseHandlingService.handleResponse(response))
      .then(
      treeNode => this.appStateManagementService
        .updateAppStateLS('TreeNode', JSON.stringify(treeNode.payload))
      )
      .catch(reason => this.responseHandlingService.handleError(reason));
  }

  getCookie(key: string) {
    return this._cookieService.get(`${environment.appName}.${key}`);
  }

  getToken() {
    if (this._cookieService.get(`${environment.appName}.token`)) {
      return JSON.parse(this._cookieService.get(`${environment.appName}.token`));
    } else {
      return null;
    }
  }

  getCurrentProgram() {
    return this.selectedProgram;
  }

  createAuthorizationHeader(headers: Headers, allXProgramIds = false) {
    headers.append('XApplicationLiteral', environment.appName);

    if (this.getToken()) {
      headers.append('Authorization', `Bearer ${this.getToken().tokenString}`);
    }
    if (allXProgramIds) {
      headers.append('XProgramIds', this.getSelectedProgram(true));
    } else {
      headers.append('XProgramIds', this.getSelectedProgram());
    }
    headers.append('Content-Type', 'application/json');
  }

  getSelectedProgram(all = false) {
    try {

      if (all) {
        let programIds = '';
        if (JSON.parse(localStorage.getItem('applicablePrograms'))) {
          JSON.parse(localStorage.getItem('applicablePrograms')).forEach((programId) => {
            programIds += `${programId['programId']},`;
          });
          return programIds.slice(0, -1);
        }
      } else if (!this.selectedProgram && environment.appName === 'CRM') {
        let programIds = '';

        try {
          return this.globals.get('programWithLowestRoles')[0].program;
        } catch (ex) {
          this.getSelectedProgram(true);
        }
      } else {
        return this.selectedProgram['programId'];
      }
    } catch (ex) {
      console.log(ex)
    }
  }
}
