import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateManagementService } from './app-state-management.service';
import { AuthenticationService } from './authentication.service';
import { ResponseHandingService } from './response-handling.service';
import { UserService } from "users_modules/pages/user-management/user.service";
import { LoginService } from 'users_modules/pages/login/login.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    AppStateManagementService,
    AuthenticationService,
    ResponseHandingService,
    UserService,
    LoginService,
  ]
})
export class LrSharedServicesModule { }
