import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news-report',
  templateUrl: './news-report.component.html',
  styleUrls: ['./news-report.component.scss'],
})
export class NewsReportComponent implements OnInit {
  constructor() {}
  startDate: NgbDateStruct | undefined;
  endDate: NgbDateStruct | undefined;
  ngOnInit(): void {}
}
