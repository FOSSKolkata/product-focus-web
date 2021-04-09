import { Component, Input, OnInit, Output } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.css']
})
export class DragComponent implements OnInit {
  public style: object = {};
  @Input('text') text: string = '';
  @Input('background-color') backgroundColor: string = '';
  @Input('top') top: string = '';
  @Input('left') @Output('left') left: string = '';
  @Input('width') @Output('width') width: string = '';
  constructor() { }

  ngOnInit(): void {
  }

  tempWidth:Number = 0;
  tempRight:Number = 0;
  onResizeStart(event: ResizeEvent): void{
    console.log(event.rectangle);
  }

  onResizeEnd(event: ResizeEvent): void {
    console.log(event.rectangle);
    this.style = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  }
}
