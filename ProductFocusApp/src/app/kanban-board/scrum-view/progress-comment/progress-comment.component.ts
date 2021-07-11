import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-progress-comment',
  templateUrl: './progress-comment.component.html',
  styleUrls: ['./progress-comment.component.scss']
})
export class ProgressCommentComponent implements OnInit {
  @Input('progress') progress: number = 0;
  @Input('comment') comment: string = '';
  @Output('is-text-changed') isTextChanged = new EventEmitter<number | string>();
  @Input('input-style') inputStyle = {};
  @Input('label-style') labelStyle = {};
  @ViewChild('inputText') set inputTextRef(ref: ElementRef) {
    if (!!ref) {
      ref.nativeElement.focus();
    }
  }
  isProgressLabelVisible: boolean = true;
  isCommentLabelVisible: boolean = true;
  oldLabelText!: number;
  oldCommentText!: string;

  constructor() {}

  ngOnInit(): void {}

  onProgressFocusOut(event: any) {
    this.isProgressLabelVisible = true;
    if (this.oldLabelText != this.progress) {
      this.isTextChanged.emit(this.progress);
    }
  }

  onCommentFocusOut(event: any) {
    this.isCommentLabelVisible = true;
    if (this.oldCommentText != this.comment) {
      this.isTextChanged.emit(this.comment);
    }
  }

  onProgressLabelClick() {
    this.oldLabelText = this.progress;
    this.isProgressLabelVisible = false;
  }

  onCommentLabelClick() {
    this.oldCommentText = this.comment;
    this.isCommentLabelVisible = false;
  }
}
