import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  constructor(private http: _HttpClient, private request: HttpService) {}

  ngOnInit() {
    this.getUserList();
  }

  async getUserList() {
    var res: any = await this.request.getUserList();
    var userList = [];
    res.data.forEach((element) => {
      userList.push({ value: element.uid, label: element.username });
    });
    localStorage.setItem('userList', JSON.stringify(userList));
  }
}
