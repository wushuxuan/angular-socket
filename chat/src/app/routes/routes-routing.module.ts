import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
//用户管理
import { UserComponent } from './user/user.component';
//群组管理
import { GroupComponent } from './group/group.component';
import { ChannelComponent } from './group/channel/channel.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardComponent, data: { title: 'Home', titleI18n: 'Home' } },
      { path: 'usermanager', component: UserComponent, data: { title: 'User Management', titleI18n: 'User' } },
      { path: 'groupmanager', component: GroupComponent, data: { title: 'Group Management', titleI18n: 'Group' } },
      { path: 'channel', component: ChannelComponent, data: { title: 'Chat Management', titleI18n: 'Chat' } },
      { path: 'groupmanager/channel/:id', component: ChannelComponent, data: { title: 'Channel Management', titleI18n: 'Channel' } },
      { path: 'exception', loadChildren: () => import('./exception/exception.module').then((m) => m.ExceptionModule) },
      // 业务子模块
      // { path: 'widgets', loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule) },
    ],
  },
  // 全屏布局
  // {
  //     path: 'fullscreen',
  //     component: LayoutFullScreenComponent,
  //     children: [
  //     ]
  // },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: 'login', component: UserLoginComponent, data: { title: 'Login', titleI18n: 'pro-login' } },
      { path: 'register', component: UserRegisterComponent, data: { title: 'Register', titleI18n: 'pro-register' } },
      { path: 'register-result', component: UserRegisterResultComponent, data: { title: 'Result', titleI18n: 'pro-register-result' } },
      { path: 'lock', component: UserLockComponent, data: { title: 'Lock', titleI18n: 'lock' } },
    ],
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
