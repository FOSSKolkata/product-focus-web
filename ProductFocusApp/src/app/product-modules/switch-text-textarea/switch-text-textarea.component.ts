import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-switch-text-textarea',
  templateUrl: './switch-text-textarea.component.html',
  styleUrls: ['./switch-text-textarea.component.css']
})
export class SwitchTextTextareaComponent implements OnInit {

  constructor() { }

  @Input('title') title:string = '';
  @ViewChild("textArea") set textAreaRef(ref: ElementRef) {
    if (ref) {
      ref.nativeElement.focus();
    }
  }
  
  isTextVisible: boolean = true;

  ngOnInit(): void {
  }

  onFocusOut(event:any){
    this.isTextVisible = true;
  }

  onLabelClick(){
    this.isTextVisible = false;
  }
}
