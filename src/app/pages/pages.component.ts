import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
import { AppState } from 'app/app.service';
import { UserService } from 'lrshared_modules/pages/user-management/user.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'pages',
  templateUrl: './pages.component.html'
})
export class Pages {
  constructor(
    private _menuService: BaMenuService,
    private _cookieService: CookieService,
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
        // To check if User has LoggedIn
        const userData = this._cookieService.get('MERCHANDISE.userData');
        if (userData) {
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
                    if(MenuListArray.indexOf(standardMenu[i].MenuCode) > -1){
                        customMenu.push(standardMenu[i]);
                    }
                }
                this._cookieService.put('MenuListAllowed', MenuListArray);
                var PAGES_MENU_NEW = JSON.parse(JSON.stringify(PAGES_MENU));
                PAGES_MENU_NEW[0].children = customMenu;
                this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU_NEW);
            }).catch(rej => {
                console.log("Error: ",rej);
                let homeMenu = PAGES_MENU[0].children[0];
                var PAGES_MENU_NEW = JSON.parse(JSON.stringify(PAGES_MENU));
                PAGES_MENU_NEW[0].children = [homeMenu];
                this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU_NEW);
            });
        }
    }
}
