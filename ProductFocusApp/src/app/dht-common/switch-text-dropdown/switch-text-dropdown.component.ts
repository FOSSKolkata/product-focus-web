import { Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Sprint } from '../models';

@Component({
  selector: 'app-switch-text-dropdown',
  templateUrl: './switch-text-dropdown.component.html',
  styleUrls: ['./switch-text-dropdown.component.css']
})
export class SwitchTextDropdownComponent implements OnInit {
  @ViewChild(NgbDropdown)
  private dropdown!: NgbDropdown;
  @Input('text-data') title: string = "R1 - Sprint 1";
  isTextVisible: boolean = true;
  @Input('list-data') listData: Sprint[] = [];

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
    this.title = current.name;
  }
}
