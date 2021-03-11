import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsReportRoutingModule } from './news-report-routing.module';
import { NewsReportComponent } from './news-report.component';
import { DomainEventComponent } from './domain-event/domain-event.component';



@NgModule({
  declarations: [
    NewsReportComponent,
    DomainEventComponent
  ],
  imports: [
    CommonModule,
    NewsReportRoutingModule
  ]
})
export class NewsReportModule { }
