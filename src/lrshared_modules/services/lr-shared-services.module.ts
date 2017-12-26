import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateManagementService } from './app-state-management.service';
import { AuthenticationService } from './authentication.service';
import { ChangePasswordService } from './changepassword.service';
import { ResponseHandingService } from './response-handling.service';
import { CommonService } from './common-services.service';
import { UserService } from "lrshared_modules/pages/user-management/user.service";
import { LoginService } from 'lrshared_modules/pages/login/login.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    AppStateManagementService,
    AuthenticationService,
    CommonService,
    ChangePasswordService,
    ResponseHandingService,
    UserService,
    LoginService,
  ]
})
export class LrSharedServicesModule { }
