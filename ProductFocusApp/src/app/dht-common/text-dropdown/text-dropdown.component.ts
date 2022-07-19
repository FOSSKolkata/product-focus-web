import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text-dropdown',
  templateUrl: './text-dropdown.component.html',
  styleUrls: ['./text-dropdown.component.scss']
})
export class TextDropdownComponent implements OnInit {

  constructor() { }
  @Input('selected') selected: any = {};
  @Input('options') options: any[] = [];
  @Input('dhstyle') dhstyle: object = {};
  @Output('selectionChanged') selectionChange = new EventEmitter();

  ngOnInit(): void {
  }

  selectOption(event: any){
    let option = this.options.filter((option)=>event.target.value === option.name);
    let selectedObject = {item: option?option[0]: option};
    this.selectionChange.emit(selectedObject);
  }

}
