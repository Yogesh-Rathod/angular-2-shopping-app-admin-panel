import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
// import { CookieService } from 'angular2-cookie/core';
import { AppState } from 'app/app.service';
import { UserService } from 'lrshared_modules/pages/user-management/user.service';

@Component({
  selector: 'pages',
  templateUrl: './pages.component.html'
})
export class Pages {
  constructor(
    private _menuService: BaMenuService,
    // private _cookieService: CookieService,
    private global: AppState,
    private userService: UserService,
  ) {

  }

  ngOnInit() {
    this.getUserInfo();
    const globalData = this.getCookie('userData');
    this.global.set('userData', (globalData));
  }

  getCookie(key: string) {
    // return this._cookieService.get(key);
  }

    getUserInfo(){
        this.userService.fetchSingleUser().
        then((res) => {
            let userMenus = res.Data.UserMenuItems;
            let standardMenu = PAGES_MENU[0].children;
            var MenuListArray = userMenus.map(function(item) {
                return item['MenuCode'];
            });
            var customMenu = [];
            customMenu.push(standardMenu[0]);
            for(var i=1; i < standardMenu.length; i++){
                if(standardMenu[i].MenuCode.indexOf(MenuListArray) > -1){
                    customMenu.push(standardMenu[i]);
                }
            }
            PAGES_MENU[0].children = customMenu;
            this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
            
        }).catch(rej => {
            console.log("Error: ",rej);
        });
    }
}
