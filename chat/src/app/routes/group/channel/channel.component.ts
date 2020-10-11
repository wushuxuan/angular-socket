import { Component, ViewChild, OnInit, ViewChildren, TemplateRef, QueryList } from '@angular/core';
import { STColumn, STComponent, STColumnTag } from '@delon/abc/st';
import { SFSchema, SFStringWidgetSchema, SFValueChange } from '@delon/form';
import { HttpService } from '../../../services/http.service';
import { SocketService } from '../../../services/socket.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

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
  selector: 'app-channel',
  templateUrl: './channel.component.html',
})
export class ChannelComponent implements OnInit {
  constructor(
    private request: HttpService,
    private modalService: NzModalService,
    private router: Router,
    private route: ActivatedRoute,
    private socketservice: SocketService,
    private message: NzMessageService,
  ) {
    this.route.params.subscribe((data) => {
      if (data.id) {
        this.groupId = data.id;
        this.getChannel();
        this.getGroupDetail();
      } else {
        this.getAllChannel();
      }
    });
  }
  @ViewChildren(TemplateRef) actionSetting: QueryList<TemplateRef<any>>;
  @ViewChildren(TemplateRef) actionEdit: QueryList<TemplateRef<any>>;

  groupId: any;
  groupDetail: any;
  editId: any;
  user: any;

  numusers: number = 0;
  currentroom: any;
  messagecontent: any;
  messages: any = [];
  rooms = [];
  roomslist: string = '';
  roomnotice: string = '';
  isinRoom = false;
  newroom: string = '';

  msg: any;

  channelList: any;
  channelDetail: any;

  //弹窗
  isVisible: boolean = false;
  modalTitle: any = 'Add';
  formData: any;
  userList: any;
  schema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: 'channel name',
      },
      users: {
        type: 'number',
        title: 'Invite people',
        ui: {
          widget: 'select',
          mode: 'tags',
          asyncData: () => of([]).pipe(delay(100)),
        },
      },
    },
    required: ['name'],
  };

  ngOnInit() {
    this.socketservice.initSocket();
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.socketservice.getMessage((m) => {
      this.messages.push(m);
    });
    this.socketservice.notice((msg) => {
      this.roomnotice = msg;
    });
    this.socketservice.joined((msg) => {
      this.currentroom = msg;
    });
    this.getUserList();
  }

  //发送消息
  send() {
    console.log('msg:' + this.msg);
    console.log({ msg: this.msg, type: 'text', userId: JSON.parse(sessionStorage.getItem('user')).uid });
    this.msg = { msg: this.msg, type: 'text', userId: JSON.parse(sessionStorage.getItem('user')).uid };
    if (this.msg) {
      this.socketservice.sendMessage(this.msg);
      this.msg = null;
    } else {
      console.log('No Message');
    }
  }

  getGroupDetail() {
    this.request.getGroupItem({ id: this.groupId }).then((res: any) => {
      this.groupDetail = res.data[0];
    });
  }

  getAllChannel() {
    this.request.getChannels().then((res: any) => {
      if (res.data && res.data.length > 0) {
        var channelList: any = [];
        res.data.forEach((element) => {
          if (element.users.indexOf(this.user.uid) > -1) {
            channelList.push(element);
          }
        });
        console.log('channelList:');
        console.log(channelList);
        // if (channelList && channelList.length > 0) {
        //   this.channelDetail = channelList[0];
        //   this.getChannelDetail();
        // }
        this.channelList = channelList;
      } else {
        this.channelList = [];
      }
    });
  }

  //聊天发送图片
  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.msg = { msg: info.file.response.filename, type: 'img', userId: JSON.parse(sessionStorage.getItem('user')).uid };
      if (this.msg) {
        this.socketservice.sendMessage(this.msg);
        this.msg = null;
      } else {
        console.log('No Message');
      }
    } else if (info.file.status === 'error') {
      // this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  getChannel() {
    this.request.getChannel({ id: this.groupId }).then((res: any) => {
      this.channelList = res.data;
      // if (res.data && res.data.length > 0) {
      //   this.channelDetail = res.data[0];
      //   this.getChannelDetail();
      // }
    });
  }

  clickItem(item) {
    console.log(item);
    if (this.currentroom) {
      this.message.info('Please leave the current chat room first');
    } else {
      // this.leaveChannel(this.channelDetail);
      this.channelDetail = item;
      this.messages = item.record; //聊天室历史聊天记录
      this.roomnotice = null;
      this.socketservice.joinroom(this.channelDetail.uid);
      this.socketservice.reqnumusers(this.channelDetail.uid);
      this.socketservice.getnumusers((res) => {
        this.numusers = res;
      });
    }
  }

  editChannel(item) {
    console.log(item);
    this.isVisible = true;
    this.editId = item.uid;
    this.modalTitle = 'Edit';
    this.formData = {
      name: item.name,
      users: item.users,
    };
  }

  deleteChannel(item) {
    console.log(item);
    this.request.deleteChannel({ id: item.uid }).then((res: any) => {
      console.log(res);
      if (res.data.message == 'Successfully Deleted.') {
        this.modalService.confirm({
          nzTitle: 'Tip',
          nzContent: 'Delete success',
          nzOkText: 'Ok',
          nzCancelText: 'Cancel',
        });
        this.getChannel();
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

  leaveChannel(item) {
    console.log(item);
    if (this.channelDetail) {
      this.socketservice.leaveroom(this.channelDetail.uid);
      this.socketservice.reqnumusers(this.channelDetail.uid);
      this.socketservice.getnumusers((res) => {
        this.numusers = res;
      });
      this.roomslist = null;
      this.currentroom = null;
      this.isinRoom = false;
      this.numusers = 0;
      this.roomnotice = '';
      this.messages = [];
    }
  }

  routerChannel(id) {
    this.router.navigate(['/groupmanager/channel', id]);
  }

  getUserList() {
    var userList = [];
    this.request.getUserList().then((res: any) => {
      res.data.forEach((element) => {
        userList.push({ value: element.uid, label: element.username });
      });
      this.userList = userList;
      this.schema = {
        properties: {
          name: {
            type: 'string',
            title: 'channel name',
          },
          users: {
            type: 'number',
            title: 'Invite people',
            ui: {
              widget: 'select',
              mode: 'tags',
              asyncData: () => of(userList).pipe(delay(100)),
            },
          },
        },
        required: ['name'],
      };
    });
    return userList;
  }

  addGroup() {
    this.isVisible = true;
    this.modalTitle = 'Add';
    this.formData = null;
    this.editId = null;
  }
  submit(value) {
    if (!this.formData) {
      this.request
        .saveChannel({
          name: value.name,
          groupId: this.groupId,
          users: value.users,
          // cover: value.cover.filename,
          // adminUser: value.adminUser,
        })
        .then((res) => {
          console.log(res);
          if (res.data.errorCode != -1) {
            this.handleCancel();
            this.modalService.confirm({
              nzTitle: 'Tip',
              nzContent: 'Chat room added successfully',
              nzOkText: 'Ok',
              nzCancelText: 'Cancel',
            });
            this.getChannel();
          } else {
            this.modalService.confirm({
              nzTitle: 'Tip',
              nzContent: 'The chat room name already exists',
              nzOkText: 'Ok',
              nzCancelText: 'Cancel',
            });
          }
        });
    } else {
      this.request
        .updateChannel({
          name: value.name,
          groupId: this.groupId,
          users: value.users,
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
            this.getChannel();
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
        // this.getGroup();
      } else {
        this.modalService.confirm({
          nzTitle: 'Tip',
          nzContent: 'Delete',
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
