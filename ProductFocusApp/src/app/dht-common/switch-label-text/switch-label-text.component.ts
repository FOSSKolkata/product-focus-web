import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Component({
  selector: 'app-switch-label-text',
  templateUrl: './switch-label-text.component.html',
  styleUrls: ['./switch-label-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => SwitchLabelTextComponent)
    }
  ]
})
export class SwitchLabelTextComponent implements ControlValueAccessor {

  @ViewChild('textInput') public inputElement!: ElementRef;
  private onChange!: (name: string) => void;
  private onTouched!: () => void;
  public textInput = new FormControl('');

  writeValue(text: string): void {
    this.textInput.setValue(text);
    this.title = text;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;  
  }

  setDisabledState(isDisabled: boolean) {
    if(isDisabled) {
      this.textInput.disable();
    } else {
      this.textInput.enable();
    }
  }

  @Input('text') title: string = '';
  @Input('editable') editable = true;
  @Output('textChanged') isTextChanged = new EventEmitter<string>();
  @ViewChild('inputText') set inputTextRef(ref: ElementRef) {
    if (!!ref) {
      ref.nativeElement.focus();
    }
  }
  isTextVisible: boolean = true;
  @Input('input-style') inputStyle = {};
  @Input('label-style') labelStyle = {};

  onFocusOut(event: any) {
    this.isTextVisible = true;
    this.isTextChanged.emit(this.title);
  }

  onLabelClick() {
    if(!this.editable) {
      return;
    }
    this.isTextVisible = false;
  }

  doInput() {
    this.onChange(this.textInput.value);
    this.title = this.textInput.value;
  }

  doBlur() {
    this.onTouched();
  }
}
