import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-news-report',
  templateUrl: './news-report.component.html',
  styleUrls: ['./news-report.component.scss'],
})
export class NewsReportComponent implements OnInit {
  userList: any[] = [];
  selectedUsers: any[] = [];
  moduleList: any[] = [];
  selectedModules: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  item = [1,2,3,4,5,6,7];
  constructor() {}
  ngOnInit(): void {
    this.userList = [
      { item_id: 1, item_text: 'Joydeep Pasi' },
      { item_id: 2, item_text: 'Priyam Singh' },
      { item_id: 3, item_text: 'Ruhi Shaw' },
      { item_id: 4, item_text: 'Pritam Shaw' },
      { item_id: 5, item_text: 'Vikram Shaw' },
      { item_id: 6, item_text: 'Rahul Mondal' },
      { item_id: 7, item_text: 'Akash Sharma' },
      { item_id: 8, item_text: 'Navneet Pandey' },
      { item_id: 9, item_text: 'Arun Gupta' }
    ];
    
    this.selectedUsers = [
      { item_id: 1, item_text: 'Joydeep Pasi' },
      { item_id: 2, item_text: 'Priyam Singh' },
      { item_id: 3, item_text: 'Ruhi Shaw' }
    ];

    this.moduleList = [
      { item_id: 1, item_text: 'Lorem ipsum' },
      { item_id: 2, item_text: 'Lorem ipsum' },
      { item_id: 3, item_text: 'Scrum View' },
      { item_id: 4, item_text: 'Login & Signup' },
      { item_id: 5, item_text: 'Kanban board' },
      { item_id: 6, item_text: 'Board View' }
    ];

    this.selectedModules = [
      { item_id: 1, item_text: 'Lorem ipsum' },
      { item_id: 2, item_text: 'Lorem ipsum' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onScroll() {
    if(this.item.length > 100)
      return;
    for(let i=0;i<5;i++){
      this.item.push(i);
    }
  }
}
