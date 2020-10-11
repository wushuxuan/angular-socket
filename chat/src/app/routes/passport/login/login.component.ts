import { Component, Inject, OnDestroy, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, ITokenService, SocialOpenType, SocialService } from '@delon/auth';
import { SettingsService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from '../../../services/http.service';
import { generateMixed } from '../../../shared/utils/util';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  constructor(
    fb: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
    private request: HttpService,
    private modalService: NzModalService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  // #region fields

  get userName(): AbstractControl {
    return this.form.controls.userName;
  }
  get password(): AbstractControl {
    return this.form.controls.password;
  }
  form: FormGroup;
  error = '';
  type = 0;

  // #region get captcha

  count = 0;
  interval$: any;

  // #endregion

  // #endregion

  submit(): void {
    this.error = '';
    this.userName.markAsDirty();
    this.userName.updateValueAndValidity();
    this.password.markAsDirty();
    this.password.updateValueAndValidity();
    if (this.userName.invalid || this.password.invalid) {
      return;
    }

    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    this.request
      .login({
        username: this.userName.value,
        password: this.password.value,
      })
      .then((res: any) => {
        console.log(res);
        res.data.data.token = generateMixed(12);
        // 清空路由复用信息
        this.reuseTabService.clear();
        // 设置用户Token信息
        // TODO: Mock expired value
        this.tokenService.set(res.data.data);
        this.settingsService.setUser(res.data.data);
        sessionStorage.setItem('user', JSON.stringify(res.data.data));
        // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
        this.startupSrv.load().then(() => {
          let url = this.tokenService.referrer!.url || '/';
          if (url.includes('/passport')) {
            url = '/';
          }
          this.router.navigateByUrl('/');
        });
      })
      .catch(() => {
        this.modalService.confirm({
          nzTitle: 'Tip',
          nzContent: 'Login failed, please check the account password and login again',
          nzOkText: 'Ok',
          nzCancelText: 'Cancel',
        });
      });
  }

  // #region social
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //判断是否存在superAdmin角色
    this.request.getUserList().then((res: any) => {
      console.log('用户列表：');
      console.log(res);
      var exist = false;
      res.data.forEach((element) => {
        if (element.role == 'role_01') {
          exist = true;
        }
      });
      //不存在创建
      if (!exist) {
        this.request
          .register({
            username: 'superAdmin',
            password: '123456',
            avatar: 'superAdmin.jpg',
            sex: '1',
            email: 'superAdmin@qq.com',
            role: 'role_01',
          })
          .then((res: any) => {});
      }
    });
  }
  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
