import { Injectable } from '@angular/core';
import { AppStateManagementService } from './app-state-management.service';
import { BaThemeSpinner } from 'app/theme/services/baThemeSpinner/baThemeSpinner.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {

  constructor(
    private router: Router,
    private _spinner: BaThemeSpinner,
    private appStateManagementService: AppStateManagementService
  ) { }

  initiateLogout() {
    this._spinner.show();
    this.appStateManagementService.clearAppStateLS()
      .then(() => this.appStateManagementService.clearAppStateCK())
      .then(value => {
        this.router.navigate(['/login']).then(() => {
          this._spinner.hide();
        });
      })
      .catch(reason => '');
  }
}
