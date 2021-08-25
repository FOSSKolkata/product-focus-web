import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss']
})
export class EditableTextComponent {

  @Input('text-content') textContent: string = '';
  @Input('dh-style') labelStyle = {};
  @Output('changed') isTextChanged = new EventEmitter<any>();
  @Input('validate-function') validateFunction: Function = ()=> true;

  fireEvent(event: any){
    this.isTextChanged.emit(event);
  }
}