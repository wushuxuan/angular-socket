import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3300/chat';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket;
  constructor() {}

  initSocket(): void {
    this.socket = io(SERVER_URL);
  }

  joinroom(selroom): void {
    console.log('selroom:' + selroom);
    this.socket.emit('joinRoom', selroom);
  }

  leaveroom(selroom): void {
    this.socket.emit('leaveRoom', selroom);
  }

  joined(next) {
    console.log('调用joined');
    this.socket.on('joined', (res) => next(res));
  }

  reqnumusers(selroom) {
    this.socket.emit('numusers', selroom);
  }

  getnumusers(next) {
    this.socket.on('numusers', (res) => next(res));
  }

  notice(next) {
    this.socket.on('notice', (res) => next(res));
  }

  sendMessage(message: any): void {
    this.socket.emit('message', message);
  }

  getMessage(next) {
    this.socket.on('message', (message) => next(message));
  }
}
