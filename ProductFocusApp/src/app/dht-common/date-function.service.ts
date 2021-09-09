import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DateFunctionService {
  ngbDateToDate(ngbDate: NgbDateStruct) {
    return new Date(Date.UTC(ngbDate.year,ngbDate.month - 1,ngbDate.day));
  }
  
  dateToNgbDate(date: Date): NgbDateStruct {
    return {
      day: date.getUTCDate(),
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear(),
    };
  }
}
