import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestManagementRoutingModule } from './test-management-routing.module';
import { TestPlansComponent } from './test-plans/test-plans.component';
import { TestManagementComponent } from './test-management.component';
import { NewTestPlanComponent } from './new-test-plan/new-test-plan.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TestSuitesComponent } from './test-suites/test-suites.component';
import { NgbDropdownModule, NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TestRunResultsComponent } from './test-run-results/test-run-results.component';
import { ChartComponent } from './chart/chart.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TestRunComponent } from './test-run/test-run.component';
import { TestRunResultComponent } from './test-run-result/test-run-result.component';
import { MatOptionModule } from '@angular/material/core';
import { DhtCommonModule } from '../dht-common/dht-common.module';

@NgModule({
  declarations: [TestPlansComponent,
    TestManagementComponent,
    NewTestPlanComponent,
    TestSuitesComponent,
    TestRunResultsComponent,
    ChartComponent,
    TestRunComponent,
    TestRunResultComponent
  ],
  imports: [
    CommonModule,
    TestManagementRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    NgbDropdownModule,
    NgbModalModule,
    MatCheckboxModule,
    FormsModule,
    NgbTypeaheadModule,
    MatOptionModule,
    MatSelectModule,
    DhtCommonModule
  ]
})
export class TestManagementModule { }
