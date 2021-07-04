import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { ISprint } from '../models';

@Component({
  selector: 'app-switch-text-dropdown',
  templateUrl: './switch-text-dropdown.component.html',
  styleUrls: ['./switch-text-dropdown.component.scss'],
})
export class SwitchTextDropdownComponent implements OnInit {
  @ViewChild(NgbDropdown) private dropdown!: NgbDropdown;
  @Input('text-data') textData: ISprint = {
    id: -1,
    name: '',
    startDate: new Date(),
    endDate: new Date(),
  };
  @Input('list-data') listData: ISprint[] = [];
  @Output('select') selection = new EventEmitter<ISprint>();
  isTextVisible: boolean = true;

  constructor() {}
  ngOnInit(): void {}

  onLabelClick() {
    this.dropdown.open();
  }

  onDropDownToggle(event: any) {
    console.log(event);
    this.isTextVisible = !this.isTextVisible;
  }

  select(current: ISprint) {
    this.textData = current;
    this.selection.emit(current);
  }
}
