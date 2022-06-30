import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DateFunctionService } from 'src/app/dht-common/date-function.service';
import { ISprintInput } from 'src/app/dht-common/models';
import { SprintService } from 'src/app/_services/sprint.service';

@Component({
  selector: 'app-add-sprint',
  templateUrl: './add-sprint.component.html',
  styleUrls: ['./add-sprint.component.scss']
})
export class AddSprintComponent {
  hoveredDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  productId: number;
  @Input('detailsView')sprintAddView: boolean = false;
  @Output('added') added = new EventEmitter<boolean>();
  sprintName: string = "";
  isSprintAdding = false;
  isDisabled = (date: NgbDate, current?: {year: number, month: number}) => this.isSprintAdding;
  
  sprintForm = new FormGroup({
    name: new FormControl(''),
    dates: new FormControl('',this.DateValidate())
  });
  
  constructor(private router: Router,
    private dateService: DateFunctionService,
    private toastr: ToastrService,
    private sprintService: SprintService,
    private calendar: NgbCalendar,
    private route: ActivatedRoute) {
    this.productId = this.route.snapshot.params['id'];
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 14);
  }

  addSprint(): void {
    if (this.toDate == null || this.fromDate == null) {
      alert('Please select proper date');
      return;
    }
    var input: ISprintInput = {
      productId: this.productId,
      name: this.sprintName,
      startDate: this.dateService.ngbDateToDate(this.fromDate),
      endDate: this.dateService.ngbDateToDate(this.toDate),
    };
    this.isSprintAdding = true;
    this.sprintService.addSprint(input).subscribe(
      async (x) => {
        this.sprintName = '';
        this.toastr.success('Sprint added','Success');
        this.isSprintAdding = false;
        this.added.emit(true);
        // await this.doesSprintExistSetIt();
        // this.reloadChildComponents();
      },
      (err) => {
        this.sprintName = '';
        this.toastr.error(err.error,'Failed');
        this.isSprintAdding = false;
        this.added.emit(false);
      }
    );
  }

  public get sprintname() {
    return this.sprintForm.value['name'];
  }

  public get sprintValidate(){
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
