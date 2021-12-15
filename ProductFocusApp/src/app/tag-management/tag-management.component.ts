import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tag-management',
  templateUrl: './tag-management.component.html',
  styleUrls: ['./tag-management.component.scss']
})
export class TagManagementComponent implements OnInit {

  tags = ["Activity", "Alert Dashboard", "Alert/Reminder/Notification","Android", "Android Phone", "Angular 11"];
  constructor() { }
  
  ngOnInit(): void {
  }
  remove(tag: string) {
    //delete
    console.log(tag);
  }
  
}
