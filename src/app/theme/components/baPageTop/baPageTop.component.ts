import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {GlobalState} from '../../../global.state';
import { CookieService } from 'ngx-cookie';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ChangePasswordComponent} from 'lrshared_modules/components/changepassword/changepassword.component';

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
    private modalService: NgbModal
  ) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  changePassword(){

    const activeModal = this.modalService.open(ChangePasswordComponent, { size: 'sm'});
        activeModal.componentInstance.modalHeader = "Change Password";
        activeModal.result.then((status) => {
          if (status) {
            console.log("Called Popup");          
          }
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
