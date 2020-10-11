import { Component, ViewChild, OnInit, ViewChildren, TemplateRef, QueryList } from '@angular/core';
import { STColumn, STComponent, STColumnTag } from '@delon/abc/st';
import { SFSchema, SFStringWidgetSchema, SFValueChange } from '@delon/form';
import { HttpService } from '../../services/http.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import axios from 'axios';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';

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
  selector: 'app-group',
  templateUrl: './group.component.html',
  styles: [],
})
export class GroupComponent implements OnInit {
  constructor(private request: HttpService, private modalService: NzModalService, private router: Router) {}
  @ViewChildren(TemplateRef) actionSetting: QueryList<TemplateRef<any>>;
  @ViewChildren(TemplateRef) actionEdit: QueryList<TemplateRef<any>>;

  editId: any;
  user: any;

  groupList: any;

  //弹窗
  isVisible: boolean = false;
  modalTitle: any = 'Add';
  formData: any;
  userList: any;
  schema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: 'Name',
      },
      cover: {
        type: 'string',
        title: 'Cover',
        ui: {
          widget: 'upload',
          action: 'api/group/upload',
          limit: 1,
          change: (file) => {
            console.log(file);
          },
        },
      },
      adminUser: {
        type: 'number',
        title: 'Assistant',
        ui: {
          widget: 'select',
          mode: 'tags',
          asyncData: () => of([]).pipe(delay(100)),
        },
        default: null,
      },
    },
    required: ['name', 'cover'],
  };

  getShow(adminUser: any) {
    var flag = false;
    if (adminUser.indexOf(this.user.uid) > -1) {
      flag = true;
    }
    return flag;
  }

  async ngOnInit() {
    this.getGroup();
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.getUserList();
  }

  routerChannel(id) {
    this.router.navigate(['/groupmanager/channel', id]);
  }

  getUserList() {
    this.request.getUserList().then((res: any) => {
      var userList = [];
      res.data.forEach((element) => {
        userList.push({ value: element.uid, label: element.username });
      });
      this.userList = userList;
      this.schema = {
        properties: {
          name: {
            type: 'string',
            title: 'Name',
          },
          cover: {
            type: 'string',
            title: 'Cover',
            ui: {
              widget: 'upload',
              action: 'api/group/upload',
              limit: 1,
              change: (file) => {
                console.log(file);
              },
            },
          },
          adminUser: {
            type: 'number',
            title: 'Assistant',
            ui: {
              widget: 'select',
              mode: 'tags',
              asyncData: () => of(userList).pipe(delay(100)),
            },
            default: null,
          },
        },
        required: ['name', 'cover'],
      };
    });
  }

  getGroup() {
    this.request.getGroup().then((res: any) => {
      this.groupList = res.data;
    });
  }

  addGroup() {
    this.schema = {
      properties: {
        name: {
          type: 'string',
          title: 'Name',
        },
        cover: {
          type: 'string',
          title: 'Cover',
          ui: {
            widget: 'upload',
            action: 'api/group/upload',
            limit: 1,
            change: (file) => {
              console.log(file);
            },
          },
        },
        adminUser: {
          type: 'number',
          title: 'Assistant',
          ui: {
            widget: 'select',
            mode: 'tags',
            asyncData: () => of(this.userList).pipe(delay(100)),
          },
          default: null,
        },
      },
      required: ['name', 'cover'],
    };
    this.isVisible = true;
    this.modalTitle = 'Add';
    this.formData = {
      name: null,
      cover: null,
      adminUser: [],
    };
    this.editId = null;
  }
  submit(value) {
    if (!this.formData || !this.formData.name) {
      this.request
        .saveGroup({
          name: value.name,
          cover: value.cover.filename,
          adminUser: value.adminUser,
        })
        .then((res) => {
          console.log(res);
          if (res.data.errorCode != -1) {
            this.handleCancel();
            this.modalService.confirm({
              nzTitle: 'Tip',
              nzContent: 'Add success',
              nzOkText: 'Ok',
              nzCancelText: 'Cancel',
            });
            this.getGroup();
          } else {
            this.modalService.confirm({
              nzTitle: 'Tip',
              nzContent: 'The group name already exists',
              nzOkText: 'Ok',
              nzCancelText: 'Cancel',
            });
          }
        });
    } else {
      if (!value.cover) {
        value.cover = this.formData.cover[this.formData.cover.length - 1].url.split('http://localhost:3300/img/user/')[1];
      } else if (value.cover.filename) {
        value.cover = value.cover.filename;
      }
      this.request
        .updateGroup({
          name: value.name,
          cover: value.cover,
          adminUser: value.adminUser,
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
            this.getGroup();
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

  editItem(item) {
    console.log(item);
    this.isVisible = true;
    this.modalTitle = 'Edit';
    this.editId = item.uid;
    this.formData = {
      name: item.name,
      cover: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: item.cover,
        },
      ],
      adminUser: item.adminUser,
    };
    this.schema = {
      properties: {
        name: {
          type: 'string',
          title: 'Name',
        },
        cover: {
          type: 'string',
          title: 'Cover',
          ui: {
            widget: 'upload',
            action: 'api/group/upload',
            limit: 1,
            change: (file) => {
              console.log(file);
            },
          },
        },
        adminUser: {
          type: 'number',
          title: 'Assistant',
          ui: {
            widget: 'select',
            mode: 'tags',
            asyncData: () => of(this.userList).pipe(delay(100)),
          },
          default: null,
        },
      },
      required: ['name', 'cover'],
    };
  }

  deleteItem(item) {
    console.log(item);
    this.request.deleteGroup({ id: item.uid }).then((res: any) => {
      console.log(res);
      if (res.data.message == 'Successfully Deleted.') {
        this.modalService.confirm({
          nzTitle: 'Tip',
          nzContent: 'Delete success',
          nzOkText: 'Ok',
          nzCancelText: 'Cancel',
        });
        this.getGroup();
      } else {
        this.modalService.confirm({
          nzTitle: 'Tip',
          nzContent: 'Delete fail',
          nzOkText: 'Ok',
          nzCancelText: 'Cancel',
        });
      }
    });
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
