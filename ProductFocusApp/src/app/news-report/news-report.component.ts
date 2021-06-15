import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StylingService } from '../side-nav/styling.service';

@Component({
  selector: 'app-news-report',
  templateUrl: './news-report.component.html',
  styleUrls: ['./news-report.component.css'],
})
export class NewsReportComponent implements OnInit {
  constructor(public styling: StylingService) {}
  startDate: NgbDateStruct | undefined;
  endDate: NgbDateStruct | undefined;
  ngOnInit(): void {}
}
