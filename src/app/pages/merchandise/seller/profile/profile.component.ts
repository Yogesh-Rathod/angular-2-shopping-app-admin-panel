import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie';
import * as _ from 'lodash';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private _location: Location,
    public toastr: ToastsManager,
  ) {
    this.checkAuthority();
  }

  ngOnInit() {
  }

  checkAuthority() {
    // let userAuthorization: any = this.cookieService.get('MenuListAllowed');
    // if (userAuthorization) {
    //   userAuthorization = userAuthorization.split(',');
    //   var someVariable = _.includes(userAuthorization, 'SLR');
    //   if (!someVariable) {
    //     this.toastr.error("You don't have authority to access this page.", 'Sorry!!!');
    //     this.goBack();
    //   }
    // }
  }

  goBack() {
    this._location.back();
  }

}
