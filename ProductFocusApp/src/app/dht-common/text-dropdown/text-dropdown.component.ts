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
  @Output('selectionChanged') selectionChange = new EventEmitter();

  ngOnInit(): void {
  }

  selectOption(event: any){
    this.selectionChange.emit(this.options.filter((option)=>event.target.value === option.name));
  }

}
