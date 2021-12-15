import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsReportComponent } from './news-report.component';

const routes: Routes = [
  {
    path: '',
    component: NewsReportComponent,
    data: {breadcrumb: 'News Report'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsReportRoutingModule {}
