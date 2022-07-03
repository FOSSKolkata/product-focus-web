import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { DateFunctionService } from 'src/app/dht-common/date-function.service';
import { ISprint, ISprintInput, ISprintUpdate } from 'src/app/dht-common/models';
import { SprintService } from 'src/app/_services/sprint.service';

@Component({
  selector: 'app-add-sprint',
  templateUrl: './add-sprint.component.html',
  styleUrls: ['./add-sprint.component.scss']
})
export class AddSprintComponent implements OnChanges {
  hoveredDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  @Input('updateSprint') updateSprint? : ISprint | null = null;

  productId: number;
  @Input('detailsView')sprintAddView: boolean = false;
  @Output('added') added = new EventEmitter<boolean>();
  updateMode = false;
  isSprintAdding = false;
  isDisabled = (date: NgbDate, current?: {year: number, month: number}) => this.isSprintAdding;
  
  @ViewChild('dp') private _dp!: NgbDatepicker;
  set dp(d: NgbDatepicker) {
    this._dp = d;
  }
  get dp(): NgbDatepicker {
    return this._dp;
  }
  
  sprintForm = new FormGroup({
    name: new FormControl(''),
    dates: new FormControl('',this.DateValidate())
  });
  
  constructor(private dateService: DateFunctionService,
    private toastr: ToastrService,
    private sprintService: SprintService,
    private calendar: NgbCalendar,
    private route: ActivatedRoute) {
    this.productId = this.route.snapshot.params['id'];
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 14);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(!!changes?.updateSprint && !!changes.updateSprint?.currentValue?.id) {
      this.sprintAddView = true;
      this.updateMode = true;
      setTimeout(() => {
        this.sprintname = changes.updateSprint.currentValue.name;
        this.fromDate = this.dateService.dateToNgbDate(changes.updateSprint.currentValue.startDate);
        this.toDate = this.dateService.dateToNgbDate(changes.updateSprint.currentValue.endDate);
        this.dp.navigateTo(this.dateService.dateToNgbDate(changes.updateSprint.currentValue.startDate));
      })
    }
  }

  addSprint(): void {
    if (this.toDate == null || this.fromDate == null) {
      alert('Please select proper date');
      return;
    }
    const input: ISprintInput = {
      productId: this.productId,
      name: this.sprintname,
      startDate: this.dateService.ngbDateToDate(this.fromDate),
      endDate: this.dateService.ngbDateToDate(this.toDate),
    };
    this.isSprintAdding = true;
    if(!!this.updateSprint) {
      const updatedSprint: ISprintUpdate = input;
      this.sprintService.updateSprint(this.updateSprint.id, this.productId, updatedSprint).pipe(
        finalize(() => {
          this.isSprintAdding = false;
        })
      ).subscribe(x => {
        this.sprintForm.reset();
        this.sprintAddView = false;
        this.toastr.success('Sprint Updated', 'Success');
        this.added.emit(true);
      }, err => {
        this.toastr.error(err.error, 'Failed');
        this.added.emit(false);
      })
    }
    else {
      this.sprintService.addSprint(input).subscribe(
        async (x) => {
          this.sprintForm.reset();
          this.sprintAddView = false;
          this.toastr.success('Sprint added','Success');
          this.isSprintAdding = false;
          this.added.emit(true);
        },
        (err) => {
          this.toastr.error(err.error,'Failed');
          this.isSprintAdding = false;
          this.added.emit(false);
        }
      );
    }
  }

  onAddSprintClicked() {
    this.sprintAddView = true;
    this.updateMode = false;
    this.updateSprint = null;
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 14);
    this.sprintForm.reset();
  }

  get sprintname() {
    return this.sprintForm.value['name'];
  }

  set sprintname(name: string) {
    this.sprintForm.setValue({
      name: name,
      dates: new FormControl('',this.DateValidate())
    });
  }

  get sprintValidate(){
    return this.sprintForm;
  }

  onDateSelection(date: NgbDate): void {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.sprintForm = new FormGroup({
      name: new FormControl(this.sprintForm.value['name']),
      dates: new FormControl('',this.DateValidate())
    });
  }

  DateValidate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.toDate == null)
        return {dateNotChosen: true};
      if (this.fromDate && this.toDate) {
        const isRangeValid = (this.dateService.ngbDateToDate(this.toDate).getTime()-this.dateService.ngbDateToDate(this.fromDate).getTime() > 0);
        return isRangeValid ? null : {dateRange:true};
      }
      return null;
    }
  }
  
  isHovered(date: NgbDate): boolean | null {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate): boolean | null {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate): boolean | null {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
}
