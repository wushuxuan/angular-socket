import { Component, ViewChild, OnInit } from '@angular/core';
import { STColumn, STComponent, STColumnTag } from '@delon/abc/st';
import { SFSchema, SFStringWidgetSchema, SFValueChange } from '@delon/form';
import { HttpService } from '../../services/http.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// role_01超级管理员  role_02 群组管理员 role_03助理  role_04普通用户
const ROLETYPE: STColumnTag = {
  role_01: { text: 'Super Admin', color: 'green' },
  role_02: { text: 'Group Admin', color: 'red' },
  role_03: { text: 'Assistant', color: 'blue' },
  role_04: { text: 'User', color: '' },
};
const SEXTYPE: STColumnTag = {
  1: { text: 'male', color: '' },
  0: { text: 'female', color: '' },
};

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [],
})
export class UserComponent implements OnInit {
  constructor(private request: HttpService, private modalService: NzModalService) {}

  editId: any;

  url = `api/users`;
  params = {};
  @ViewChild('st', { static: false }) private st: STComponent;
  columns: STColumn[] = [
    { title: 'username', index: 'username', width: 150 },
    { title: 'img', type: 'img', width: 150, index: 'avatar' },
    { title: 'email', index: 'email', width: 150 },
    { title: 'sex', index: 'sex', width: 150, type: 'tag', tag: SEXTYPE },
    { title: 'role', index: 'role', width: 150, type: 'tag', tag: ROLETYPE },
    { title: 'registerDate', type: 'date', index: 'registerDate', width: 150 },
    {
      title: 'operating',
      width: 150,
      buttons: [
        {
          text: 'edit',
          iif: (record: any) => {
            console.log(record);
            console.log(JSON.parse(sessionStorage.getItem('user')).role);
            var visible = false;
            // role_01超级管理员  role_02 群组管理员 role_03助理  role_04普通用户
            switch (JSON.parse(sessionStorage.getItem('user')).role) {
              case 'role_01':
                visible = true;
                break;
              case 'role_02':
                if (record.role != 'role_01') {
                  visible = true;
                }
                break;
              case 'role_03':
                if (record.role != 'role_01' && record.role != 'role_02') {
                  visible = true;
                }
                break;
            }
            return visible;
          },
          click: (_record, modal) => {
            this.modalTitle = 'Edit User';
            this.isVisible = true;
            this.editId = _record.uid;
            this.formData = {
              username: _record.username,
              password: _record.password,
              avatar: [
                {
                  uid: '-1',
                  name: 'image.png',
                  status: 'done',
                  url: _record.avatar,
                },
              ],
              sex: parseInt(_record.sex),
              email: _record.email,
              role: _record.role,
            };
          },
        },
        {
          text: 'delete',
          iif: (record: any) => {
            console.log(record);
            console.log(JSON.parse(sessionStorage.getItem('user')).role);
            var visible = false;
            // role_01超级管理员  role_02 群组管理员 role_03助理  role_04普通用户
            switch (JSON.parse(sessionStorage.getItem('user')).role) {
              case 'role_01':
                visible = true;
                break;
              case 'role_02':
                if (record.role != 'role_01') {
                  visible = true;
                }
                break;
              case 'role_03':
                if (record.role != 'role_01' && record.role != 'role_02') {
                  visible = true;
                }
                break;
            }
            return visible;
          },
          click: (_record, modal) => {
            console.log(_record);
            this.request.delete({ id: _record.uid }).then((res: any) => {
              console.log(res);
              if (res.data.message == 'Successfully Deleted.') {
                this.modalService.confirm({
                  nzTitle: 'Tip',
                  nzContent: 'Delete success',
                  nzOkText: 'Ok',
                  nzCancelText: 'Cancel',
                });
                this.st.reload();
              } else {
                this.modalService.confirm({
                  nzTitle: 'Tip',
                  nzContent: 'Delete fail',
                  nzOkText: 'Ok',
                  nzCancelText: 'Cancel',
                });
              }
            });
          },
        },
      ],
    },
  ];

  //弹窗
  isVisible: boolean = false;
  modalTitle: any = 'Add';
  formData: any;
  schema: SFSchema = {
    properties: {
      username: {
        type: 'string',
        title: 'username',
      },
      password: {
        type: 'string',
        title: 'password',
      },
      email: {
        type: 'string',
        format: 'email',
        title: 'email',
      },
      avatar: {
        type: 'string',
        title: 'avatar',
        ui: {
          widget: 'upload',
          action: 'api/user/upload',
          limit: 1,
          change: (file) => {
            console.log(file);
          },
        },
      },
      sex: {
        type: 'string',
        title: 'sex',
        ui: {
          widget: 'radio',
          asyncData: () =>
            of([
              { label: 'male', value: 1 },
              { label: 'female', value: 0 },
            ]).pipe(delay(100)),
        },
        default: 1,
      },
      role: {
        type: 'string',
        title: 'role',
        ui: {
          widget: 'radio',
          asyncData: () =>
            // role_01超级管理员  role_02 群组管理员 role_03助理  role_04普通用户
            of(this.getUserRoleList()).pipe(delay(100)),
        },
        default: 'role_04',
      },
    },
    required: ['username', 'password', 'email', 'sex', 'role'],
  };
  getUserRoleList() {
    var list = [];
    // role_01超级管理员  role_02 群组管理员 role_03助理  role_04普通用户
    switch (JSON.parse(sessionStorage.getItem('user')).role) {
      case 'role_01':
        list = [
          { label: 'Super Admin', value: 'role_01' },
          { label: 'Group Admin', value: 'role_02' },
          { label: 'Assistant', value: 'role_03' },
          { label: 'User', value: 'role_04' },
        ];
        break;
      case 'role_02':
        list = [
          { label: 'Group Admin', value: 'role_02' },
          { label: 'Assistant', value: 'role_03' },
          { label: 'User', value: 'role_04' },
        ];
        break;
      case 'role_03':
        list = [
          { label: 'Assistant', value: 'role_03' },
          { label: 'User', value: 'role_04' },
        ];
        break;
    }
    return list;
  }

  ngOnInit(): void {}

  addUser() {
    this.isVisible = true;
    this.modalTitle = 'Add';
    this.formData = null;
    this.editId = null;
  }
  submit(value) {
    if (!this.formData) {
      this.request
        .register({
          username: value.username,
          password: value.password,
          avatar: value.avatar.filename,
          sex: value.sex,
          email: value.email,
          role: value.role,
        })
        .then((res) => {
          console.log(res);
          if (res.data.errorCode != -1) {
            this.handleCancel();
            this.modalService.confirm({
              nzTitle: 'Tip',
              nzContent: 'Add user success',
              nzOkText: 'Ok',
              nzCancelText: 'Cancel',
            });
            this.st.reload();
          } else {
            this.modalService.confirm({
              nzTitle: 'Tip',
              nzContent: 'Email already exists',
              nzOkText: 'Ok',
              nzCancelText: 'Cancel',
            });
          }
        });
    } else {
      if (!value.avatar) {
        value.avatar = this.formData.avatar[this.formData.avatar.length - 1].url.split('http://localhost:3300/img/user/')[1];
      } else if (value.avatar.filename) {
        value.avatar = value.avatar.filename;
      }
      this.request
        .update({
          username: value.username,
          password: value.password,
          avatar: value.avatar,
          sex: value.sex,
          email: value.email,
          role: value.role,
          id: this.editId,
        })
        .then((res) => {
          console.log(res);
          if (res.data.errorCode != -1) {
            this.handleCancel();
            this.modalService.confirm({
              nzTitle: 'Tip',
              nzContent: 'Edit success',
              nzOkText: 'Ok',
              nzCancelText: 'Cancel',
            });
            this.st.reload();
          } else {
            this.modalService.confirm({
              nzTitle: 'Tip',
              nzContent: 'Edit fail',
              nzOkText: 'Ok',
              nzCancelText: 'Cancel',
            });
          }
        });
    }
  }

  //弹窗
  handleCancel() {
    this.isVisible = false;
    this.modalTitle = null;
    this.formData = null;
    this.editId = null;
  }
  handleOk() {
    this.isVisible = false;
  }
}
