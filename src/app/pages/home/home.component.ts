import { Component, OnInit } from '@angular/core';

import { AppStateManagementService } from 'users_modules/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userInfo: any;

  constructor(
    private appStateManagementService: AppStateManagementService
  ) {
    this.appStateManagementService.retrieveAppStateCK('MERCHANDISE.userData').
      then((userInfo) => {
        this.userInfo = JSON.parse(userInfo);
      }).catch((error) => {
        this.userInfo = {
          username: 'Unknown User'
        }
      });
  }

  ngOnInit() {
  }

}
