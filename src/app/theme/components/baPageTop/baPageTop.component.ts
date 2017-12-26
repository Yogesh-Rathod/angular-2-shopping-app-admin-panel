import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {GlobalState} from '../../../global.state';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss'],
})
export class BaPageTop {

  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = false;

  constructor(
    private _state: GlobalState,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

    signOut() {
      console.log("signOut ");
      this.cookieService.removeAll();
      this.router.navigate(['/login']);
    }
}
