import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-switch-text-datepick',
  templateUrl: './switch-text-datepick.component.html',
  styleUrls: ['./switch-text-datepick.component.scss']
})
export class SwitchTextDatepickComponent implements OnChanges {
  @Input('date') date: Date | null = null;
  @Output('date-changed') dateChange = new EventEmitter<Date>();
  @Input('min') minDate: Date | null = null;
  @Input('max') maxDate: Date | null = null;
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
    console.log("Min Date: ",this.minDate);
    console.log(event.value,"event");
    this.dateChange.emit(event.value);
  }
}
