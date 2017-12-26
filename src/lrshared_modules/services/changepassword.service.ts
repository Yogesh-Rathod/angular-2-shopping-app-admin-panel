import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from 'environments/environment';
import { ResponseHandingService } from './response-handling.service';
import { CommonService } from './common-services.service';
import { AppState } from 'app/app.service';

@Injectable()
export class ChangePasswordService {

  constructor(
    private http: Http,
    private responseHandingService: ResponseHandingService,
    private lrCommonService: CommonService,
    private globals: AppState
  ) { }

  getUserByToken(programId, token): Promise<any> {
    const header = new Headers();
    this.lrCommonService.createAuthorizationHeader(header);

    header.set('XServiceName', 'getuserbytoken');
    const url = `${environment.rbacUrl}/user`;
    const options = new RequestOptions({ headers: header });
    return this.http.get(url, options)
      .timeout(environment.timeOut)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }

  changePassword(postData): Promise<any> {
    const url = `${environment.rbacUrl}/user/Byusername/${this.globals.get('userData').username}/changePassword`;

    const header = new Headers();
    this.lrCommonService.createAuthorizationHeader(header);
    header.set('XServiceName', 'changepassword');

    const options = new RequestOptions({ headers: header });
    return this.http.post(url, postData, options)
      .timeout(environment.timeOut)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }
}

