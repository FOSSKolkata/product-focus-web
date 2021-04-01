import { Component, Input, OnInit, Output } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-test-drag',
  templateUrl: './test-drag.component.html',
  styleUrls: ['./test-drag.component.css']
})
export class TestDragComponent implements OnInit {
  public style: object = {};
  @Input('text') text: string = '';
  @Input('background-color') backgroundColor: string = '';
  @Input('top') top: string = '';
  @Input('left') @Output('left') left: string = '';
  @Input('width') @Output('width') width: string = '';
  constructor() { }

  ngOnInit(): void {
  }

  onResizeEnd(event: ResizeEvent): void {
    console.log('Element was resized', event);
    this.style = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  }
}
