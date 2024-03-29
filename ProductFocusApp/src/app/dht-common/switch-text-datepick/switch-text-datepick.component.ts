import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-switch-text-datepick',
  templateUrl: './switch-text-datepick.component.html',
  styleUrls: ['./switch-text-datepick.component.scss']
})
export class SwitchTextDatepickComponent implements OnChanges {
  @Input('date') date: Date | null = null;
  @Output('changed') dateChange = new EventEmitter<Date>();
  @Input('min') minDate: Date | null = null;
  @Input('max') maxDate: Date | null = null;
  @Input('style') style!: {};
  @Input('placeholder') placeholder = "";
  curr: FormControl;
  constructor() {
    const currentYear = new Date().getFullYear();
    this.curr = new FormControl();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.date != null)
      this.curr = new FormControl(new Date(this.date));
  }

  dateChanged(event: any){
    this.dateChange.emit(event.value);
  }
}
