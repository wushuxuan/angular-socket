import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  reqAddress: any = 'api/';

  constructor() {}

  login(params) {
    return axios({
      url: this.reqAddress + 'user/login',
      method: 'post',
      data: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  register(params) {
    return axios({
      url: this.reqAddress + 'user/register',
      method: 'post',
      data: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  delete(params) {
    return axios({
      url: this.reqAddress + 'users/' + params.id,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  update(params) {
    return axios({
      url: this.reqAddress + 'users/' + params.id,
      method: 'put',
      data: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  getUserList() {
    return axios({
      url: this.reqAddress + 'users',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  //群组
  getGroup() {
    return axios({
      url: this.reqAddress + 'groups',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  getChannels() {
    return axios({
      url: this.reqAddress + 'channels',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  getChannel(params) {
    return axios({
      url: this.reqAddress + 'channel/' + params.id,
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  getGroupItem(params) {
    return axios({
      url: this.reqAddress + 'groups/' + params.id,
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  deleteGroup(params) {
    return axios({
      url: this.reqAddress + 'groups/' + params.id,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  updateGroup(params) {
    return axios({
      url: this.reqAddress + 'groups/' + params.id,
      method: 'put',
      data: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  saveGroup(params) {
    return axios({
      url: this.reqAddress + 'group/save',
      method: 'post',
      data: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  //群组
  saveChannel(params) {
    return axios({
      url: this.reqAddress + 'channel/save',
      method: 'post',
      data: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  updateChannel(params) {
    return axios({
      url: this.reqAddress + 'channel/' + params.id,
      method: 'put',
      data: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }

  deleteChannel(params) {
    return axios({
      url: this.reqAddress + 'channel/' + params.id,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      withCredentials: true,
    });
  }
}
