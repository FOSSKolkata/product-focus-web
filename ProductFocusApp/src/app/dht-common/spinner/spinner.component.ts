import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  @Input('is-spinner-active') isSpinnerActive: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
