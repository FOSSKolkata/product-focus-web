import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Sprint } from '../models';

@Component({
  selector: 'app-switch-text-dropdown',
  templateUrl: './switch-text-dropdown.component.html',
  styleUrls: ['./switch-text-dropdown.component.css']
})
export class SwitchTextDropdownComponent implements OnInit {
  @ViewChild(NgbDropdown) private dropdown!: NgbDropdown;
  @Input('text-data') textData: Sprint = {
    id: -1,
    name: '',
    startDate: new Date(),
    endDate: new Date()
  };
  @Input('list-data') listData: Sprint[] = [];
  @Output('select') selection = new EventEmitter<Sprint>();
  isTextVisible: boolean = true;

  constructor() { }
  ngOnInit(): void {

  }

  onLabelClick() {
    this.dropdown.open();
  }

  onDropDownToggle(event:any) {
    console.log(event)
    this.isTextVisible = !this.isTextVisible;
  }
  
  select(current: Sprint) {
    this.textData = current;
    this.selection.emit(current);
  }
}
