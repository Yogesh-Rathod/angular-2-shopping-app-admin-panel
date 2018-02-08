import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import * as _ from 'lodash';
import { Location } from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  isToasterPresent = false;

  constructor(
    private _cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
    public toastr: ToastsManager,
    private _location: Location
  ) { }

  canActivate() {
    let userInfo = this._cookieService.get('MERCHANDISE.userData');
    if (userInfo) {
      this.router.navigate(['/']);
    }
    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot) {
    let userInfo = this._cookieService.get('MERCHANDISE.userData');
    let userAuthorization: any = this._cookieService.get('MenuListAllowed');
    if (userAuthorization) {
      userAuthorization = userAuthorization.split(',');
    }
    const hasAuthority = _.includes(userAuthorization, route.data.MenuCode);
    if (userInfo && !hasAuthority) {
      if (route.data.MenuCode !== 'HOM') {
        if (!this.isToasterPresent) {
          this.toastr.error("You don't have authority to access this page!", 'Sorry!');
          this.isToasterPresent = true;
          setTimeout(() => {
            this.isToasterPresent = false;
          }, 1000);
        }
        this.goBackHome();
      }
    }

    if (!userInfo) {
        if (!this.isToasterPresent) {
        this.toastr.error('Something went wrong! You need to Login!', 'Error!');
        this.isToasterPresent = true;
      }
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    }
    return true;
  }

  goBackHome() {
    this.router.navigate(['/home']);
    return;
  }


}