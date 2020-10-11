import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';

import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  private viaHttp(resolve: any, reject: any) {
    zip(this.httpClient.get('assets/tmp/app-data.json'))
      .pipe(
        catchError((res) => {
          console.warn(`StartupService.load: Network request failed`, res);
          resolve(null);
          return [];
        }),
      )
      .subscribe(
        ([appData]) => {
          // Application data
          const res: any = appData;
          // Application information: including site name, description, year
          this.settingService.setApp(res.app);
          // User information: including name, avatar, email address
          this.settingService.setUser(res.user);
          // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
          this.aclService.setFull(true);
          // Menu data, https://ng-alain.com/theme/menu
          this.menuService.add(res.menu);
          // Can be set page suffix title, https://ng-alain.com/theme/title
          this.titleService.suffix = res.app.name;
        },
        () => {},
        () => {
          resolve(null);
        },
      );
  }

  private viaMock(resolve: any, reject: any) {
    // const tokenData = this.tokenService.get();
    // if (!tokenData.token) {
    //   this.injector.get(Router).navigateByUrl('/passport/login');
    //   resolve({});
    //   return;
    // }
    // mock
    const app: any = {
      name: `Chat`,
    };
    // role_01超级管理员  role_02 群组管理员 role_03助理  role_04普通用户
    // Application information: including site name, description, year
    this.settingService.setApp(app);
    // User information: including name, avatar, email address
    // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
    this.aclService.setFull(true);
    console.log(this.settingService.user);
    if (JSON.parse(sessionStorage.getItem('user'))) {
      switch (JSON.parse(sessionStorage.getItem('user')).role) {
        //超级管理员
        case 'role_01':
          this.menuService.add([
            {
              text: 'Main',
              group: true,
              children: [
                {
                  text: 'Home',
                  link: '/home',
                  icon: { type: 'icon', value: 'appstore' },
                },
                {
                  text: 'User Management',
                  link: '/usermanager',
                  icon: { type: 'icon', value: 'user' },
                },
                {
                  text: 'Group Management',
                  link: '/groupmanager',
                  icon: { type: 'icon', value: 'team' },
                },
              ],
            },
          ]);
          break;
        //群组管理员
        case 'role_02':
          this.menuService.add([
            {
              text: 'Main',
              group: true,
              children: [
                {
                  text: 'Home',
                  link: '/home',
                  icon: { type: 'icon', value: 'appstore' },
                },
                {
                  text: 'User Management',
                  link: '/usermanager',
                  icon: { type: 'icon', value: 'user' },
                },
                {
                  text: 'Group Management',
                  link: '/groupmanager',
                  icon: { type: 'icon', value: 'team' },
                },
              ],
            },
          ]);
          break;
        //助理
        case 'role_03':
          this.menuService.add([
            {
              text: 'Main',
              group: true,
              children: [
                {
                  text: 'Home',
                  link: '/home',
                  icon: { type: 'icon', value: 'appstore' },
                },
                {
                  text: 'Group Management',
                  link: '/groupmanager',
                  icon: { type: 'icon', value: 'team' },
                },
              ],
            },
          ]);
          break;
        //普通用户
        case 'role_04':
          this.menuService.add([
            {
              text: 'Main',
              group: true,
              children: [
                {
                  text: 'Home',
                  link: '/home',
                  icon: { type: 'icon', value: 'appstore' },
                },
                {
                  text: 'Chat Management',
                  link: '/channel',
                  icon: { type: 'icon', value: 'message' },
                },
              ],
            },
          ]);
          break;
      }
    }
    // Menu data, https://ng-alain.com/theme/menu
    // Can be set page suffix title, https://ng-alain.com/theme/title
    this.titleService.suffix = app.name;

    resolve({});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      this.viaMock(resolve, reject);
    });
  }
}
