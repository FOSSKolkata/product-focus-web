import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { ISprint } from '../models';

@Component({
  selector: 'app-switch-text-dropdown',
  templateUrl: './switch-text-dropdown.component.html',
  styleUrls: ['./switch-text-dropdown.component.scss'],
})
export class SwitchTextDropdownComponent {
  @ViewChild(NgbDropdown) private dropdown!: NgbDropdown;
  @Input('text-data') textData: any = {
    id: -1,
    name: ''
  };
  @Input('list-data') listData: any[] = [];
  @Output('select') selection = new EventEmitter<any>();
  isTextVisible: boolean = true;

  onLabelClick() {
    this.dropdown.open();
  }

  onDropDownToggle(event: any) {
    this.isTextVisible = !this.isTextVisible;
  }

  select(current: any) {
    this.textData = current;
    this.selection.emit(current);
  }
}
