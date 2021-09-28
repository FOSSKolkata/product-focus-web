import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsReportRoutingModule } from './news-report-routing.module';
import { NewsReportComponent } from './news-report.component';
import { DomainEventComponent } from './domain-event/domain-event.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DhtCommonModule } from '../dht-common/dht-common.module';
import { MatCardModule } from '@angular/material/card';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [NewsReportComponent, DomainEventComponent],
  imports: [
    CommonModule,
    NewsReportRoutingModule,
    NgbModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    DhtCommonModule,
    MatCardModule,
    InfiniteScrollModule,
    MatOptionModule,
    MatSelectModule
  ],
})
export class NewsReportModule {}
