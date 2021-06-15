import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsReportRoutingModule } from './news-report-routing.module';
import { NewsReportComponent } from './news-report.component';
import { DomainEventComponent } from './domain-event/domain-event.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NewsReportComponent, DomainEventComponent],
  imports: [CommonModule, NewsReportRoutingModule, NgbModule, FormsModule],
})
export class NewsReportModule {}
