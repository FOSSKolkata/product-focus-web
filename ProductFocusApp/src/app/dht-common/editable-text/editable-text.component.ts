import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss']
})
export class EditableTextComponent implements OnInit {

  @Input('text-content') textContent: string = '';
  @Output('changed') isTextChanged = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  fireEvent(event: any){
    this.isTextChanged.emit(event);
  }

}