import { Injectable } from '@angular/core';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DateFunctionService {
  ngbDateToDate(ngbDate: NgbDateStruct) {
    return new Date(Date.UTC(ngbDate.year,ngbDate.month - 1,ngbDate.day));
  }
  
  dateToNgbDate(date: Date | string): NgbDate {
    date = new Date(date);
    return {
      day: date.getUTCDate() + 1,
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear(),
    } as NgbDate;
  }
}
