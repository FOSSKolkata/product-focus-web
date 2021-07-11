import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-switch-text-input',
  templateUrl: './switch-text-input.component.html',
  styleUrls: ['./switch-text-input.component.scss']
})
export class SwitchTextInputComponent implements OnInit {
  @Input('title') title: string = '';
  @Output('is-text-changed') isTextChanged = new EventEmitter<string>();

  @ViewChild('inputText') set inputTextRef(ref: ElementRef) {
    if (!!ref) {
      ref.nativeElement.focus();
    }
  }
  isTextVisible: boolean = true;
  oldText!: string;
  @Input('input-style') inputStyle = {};
  @Input('label-style') labelStyle = {};

  constructor() {}

  ngOnInit(): void {}

  onFocusOut(event: any) {
    this.isTextVisible = true;
    if (this.oldText != this.title) {
      this.isTextChanged.emit(this.title);
    }
  }

  onLabelClick() {
    this.oldText = this.title;
    this.isTextVisible = false;
  }
}
