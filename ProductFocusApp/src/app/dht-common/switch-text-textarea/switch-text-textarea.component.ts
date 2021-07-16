import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-switch-text-textarea',
  templateUrl: './switch-text-textarea.component.html',
  styleUrls: ['./switch-text-textarea.component.scss'],
})
export class SwitchTextTextareaComponent implements OnInit {
  @Input('title') title: string = '';
  @Output('is-text-changed') isTextChanged = new EventEmitter<string>();
  @ViewChild('textArea') set textAreaRef(ref: ElementRef) {
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
