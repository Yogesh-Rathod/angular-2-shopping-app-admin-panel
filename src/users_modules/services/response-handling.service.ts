import { Injectable } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { AuthenticationService } from './authentication.service';
import { environment } from 'environments/environment';

@Injectable()
export class ResponseHandingService {

  constructor(
    private authenticationService: AuthenticationService,
    private toastr: ToastsManager
  ) { }

  handleError(error: any): Promise<any> {
    let rejParse;
    try {
      rejParse = JSON.parse(error._body);
    } catch (ex) {
      rejParse = {
        message: 'Something went wrong.',
        status: 0
      };
    }
    if (error.status === 401) {
      this.toastr.error(rejParse.message || 'Unauthorised access, please login to continue.')
        .then(() => this.logoutAfterDelay());
    } else if (error.status === 403) {
    }

    try {
      return Promise.reject(rejParse || error);
    } catch (ex) {
      return Promise.reject(error);
    }
  }

  logoutAfterDelay() {
    setTimeout(() => {
      this.authenticationService.initiateLogout();
    }, 2000);
  }

  handleResponse(response: any): Promise<any> {
    const emptyArr: any = [];
    if (response.status >= 200 || response.status < 204) {
      return response.json();
    } else if (response.status === 204) {
      return emptyArr;
    }
  }
}
