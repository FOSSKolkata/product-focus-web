import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IFeatureAssignee } from 'src/app/dht-common/models';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnChanges {

  @Input('user-list') userList: IFeatureAssignee[] = [];
  userListShow: IFeatureAssignee[] = [];
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.userListShow = [];
    for(var i=0;i<this.userList.length && i<3;i++)
    this.userListShow.push(this.userList[i]);
  }

  ngOnInit(): void {

  }

}
