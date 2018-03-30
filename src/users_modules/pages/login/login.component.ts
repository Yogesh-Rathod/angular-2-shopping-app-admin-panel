/**
 * @author Shyam Gupta
 * @email shyam.gupta@loylty.in
 * @create date 2017-08-18 05:54:57
 * @modify date 2017-08-18 05:54:57
*/

import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { environment } from 'environments/environment';
import { GlobalState } from 'app/global.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MerchandiseService } from 'users_modules/services/roleServices';
import { BaThemeSpinner } from 'app/theme/services';
import { AppStateManagementService } from 'users_modules/services';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    isError = false;
    errorMessage: string;
    isHidden = true;
    isHiddenForgot = true;
    role: any = [];
    forgotPassword = false;
    forgotPasswordForm: FormGroup;
    email: AbstractControl;
    password: AbstractControl;
    forgotPasswordEmail: AbstractControl;
    rememberMe: AbstractControl;

    constructor(
        private appStateManagementService: AppStateManagementService,
        private _cookieService: CookieService,
        private fb: FormBuilder,
        private router: Router,
        private loginService: LoginService,
        private toastr: ToastsManager,
        private vcr: ViewContainerRef,
        private _state: GlobalState,
        private activeModal: NgbActiveModal,
        private merchandiseService: MerchandiseService,
        private _spinner: BaThemeSpinner,
    ) {

    }

    ngOnInit() {
        this.createForms();
        this.setLoginFormValues();
    }

    setLoginFormValues() {
        this.appStateManagementService.retrieveAppStateLS('userCredentials').
            then((userCredential) => {
                if (userCredential) {
                    const userCred = JSON.parse(userCredential);
                    this.loginForm.controls['email'].patchValue(userCred.username);
                    this.loginForm.controls['password'].patchValue(userCred.password);
                    this.loginForm.controls['rememberMe'].patchValue('true');
                }
            });
    }

    createForms() {
        this.loginForm = this.fb.group({
            'email': ['', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$|^[a-zA-Z0-9.-_]*$')
            ])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            'rememberMe': ['']
        });

        this.email = this.loginForm.controls['email'];
        this.password = this.loginForm.controls['password'];
        this.rememberMe = this.loginForm.controls['rememberMe'];

        this.forgotPasswordForm = this.fb.group({
            // tslint:disable-next-line:max-line-length
            'forgotPasswordEmail': ['', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$|^[a-zA-Z0-9.-_]*$')
            ])],
        });

        this.forgotPasswordEmail = this.forgotPasswordForm.controls['forgotPasswordEmail'];
    }

    onForgotFormSubmit(value) {
        if (this.forgotPasswordForm.valid && this.isHiddenForgot) {
            this.isHiddenForgot = false;
            this.loginService.userResetPassword(value.forgotPasswordEmail)
                .then((res) => {
                    this.isHiddenForgot = true;
                    this.forgotPassword = false;
                    this.forgotPasswordForm.reset();
                    this.toastr.success('A new password has been sent to your e-mail address.');
                })
                .catch(rej => {
                    this.isHiddenForgot = true;
                    this.errorMessage = rej.message ? rej.message : 'Sorry, something went wrong. Please try again later.';
                    this.toastr.error(this.errorMessage);
                });
        }
    }

    onSubmit(loginForm) {
        if (loginForm.value.rememberMe) {
            const userCredentials = {
                username: loginForm.value.email,
                password: loginForm.value.password
            };
            this.appStateManagementService.updateAppStateLS('userCredentials', JSON.stringify(userCredentials));
        } else {
            this.appStateManagementService.clearAppStateLSSingle('userCredentials');
        }
        try {
            if (loginForm.valid && this.isHidden) {
                this.isHidden = false;

                this.loginService.userLogin({ UserName: loginForm.value.email, Password: loginForm.value.password })
                    .then((res) => {
                        this.isHidden = true;
                        if (res.Code === 500) {
                            this.toastr.error('Login failed! Please recheck username & password.');
                            return;
                        }
                        const loginPayload = {
                            accessToken: res.Data.Accesstoken,
                            refreshToken: res.Data.RefreshToken
                        };
                        this.setCookieData(loginPayload, environment.appName);
                    })
                    .catch(rej => {
                        this.isHidden = true;
                        this.errorMessage = rej.message ? rej.message : 'Sorry, something went wrong. Please try again later.';
                        this.toastr.error(this.errorMessage);
                    });
            }
        } catch (ex) {
        }
    }

    setCookie(key: string, value: string) {
        return this._cookieService.put(key, value, {
            domain: environment.domainName
        });
    }

    setCookieData(loginPayload, appName) {
        this.role.push(loginPayload);

        this._state.notifyDataChanged('loginSetCookie', true);

        this._cookieService.put(`${environment.appName}.token`, JSON.stringify(loginPayload));

        this._cookieService.put(`${environment.appName}.userData`, JSON.stringify({
            username: loginPayload.username || this.loginForm.value.email.toLowerCase(),
        }));

        switch (environment.appName) {

            case 'MERCHANDISE':
                this.merchandiseService.init()
                    .then(() => {
                        this.navigateToDashboard();
                    })
                    .catch(() => {
                        this.somethingWentWrong();
                    });
                break;

            default:
                this.somethingWentWrong();
                break;
        }
    }

    somethingWentWrong() {
        this.isHidden = true;
        this._spinner.hide();
        this.toastr.error('Something went wrong please try again.');
    }

    navigateToDashboard() {
        this.router.navigate(['/']).then(() => {
            this.isHidden = true;
            this._spinner.hide();
            setTimeout(() => {
                this._state.notifyDataChanged('loginSetCookie', false);
            }, 1500);
        })
            .catch((ex) => {
                this.isHidden = true;
            });
    }

    backToLogin() {
        this.forgotPasswordForm.reset();
        this.forgotPassword = false;
    }
}
