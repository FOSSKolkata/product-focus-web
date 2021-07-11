import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-switch-text-datepick',
  templateUrl: './switch-text-datepick.component.html',
  styleUrls: ['./switch-text-datepick.component.scss']
})
export class SwitchTextDatepickComponent implements OnInit, OnChanges {
  @Input('date') date!: Date;
  @Output('date-changed') dateChange = new EventEmitter<Date>();
  @Input('min') minDate: Date | null = null;
  @Input('max') maxDate: Date | null = null;
  curr: FormControl;
  constructor() {
    const currentYear = new Date().getFullYear();
    this.curr = new FormControl(new Date());
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.curr = new FormControl(new Date(this.date));
  }

  ngOnInit(): void {
    
  }

  dateChanged(event: any){
    console.log("Min Date: ",this.minDate);
    console.log(event.value,"event");
    this.dateChange.emit(event.value);
  }
}
