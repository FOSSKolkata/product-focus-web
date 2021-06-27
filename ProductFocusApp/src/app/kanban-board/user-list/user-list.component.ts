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
  ngOnInit(): void {
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.removeDuplicateUser();
    this.userListShow = [];
    for(var i=0;i<this.userList.length && i<3;i++)
    this.userListShow.push(this.userList[i]);
  }
  removeDuplicateUser() {
    var set = new Set();
    var temp: IFeatureAssignee[] = [];
    for(var obj of this.userList){
      if(!set.has(obj.email)){
        set.add(obj.email);
        temp.push(obj);
      }
    }
    this.userList = temp;
  }
}