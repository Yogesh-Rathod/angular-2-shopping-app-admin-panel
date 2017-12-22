import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  isToasterPresent = false;

  constructor(
    private _cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
    public toastr: ToastsManager,
  ) { }

  canActivate() {
    let userInfo = this._cookieService.get('MERCHANDISE.userData');
    if (userInfo) {
      this.router.navigate(['/']);
    }
    return true;
  }

  canActivateChild() {
    let userInfo = this._cookieService.get('MERCHANDISE.userData');
    if (!userInfo) {
      if (!this.isToasterPresent) {
        this.toastr.error('Something went wrong! You need to Login!', 'Error!');
        this.isToasterPresent = true;
      }
      setTimeout(() => {
        this.router.navigate(['/home']);
        // this.router.navigate(['/login']);
      }, 1000);
    }
    return true;
  }

}