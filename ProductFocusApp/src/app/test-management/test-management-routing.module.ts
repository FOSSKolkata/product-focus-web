import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewTestPlanComponent } from './new-test-plan/new-test-plan.component';
import { TestManagementComponent } from './test-management.component';
import { TestPlansComponent } from './test-plans/test-plans.component';
import { TestRunResultComponent } from './test-run-result/test-run-result.component';
import { TestRunResultsComponent } from './test-run-results/test-run-results.component';
import { TestRunComponent } from './test-run/test-run.component';
import { TestSuitesComponent } from './test-suites/test-suites.component';

const routes: Routes = [
  {
    path: '',
    component: TestManagementComponent,
    data: {breadcrumb: {skip: true}},
    children: [
      {
        path: '',
        redirectTo: 'test-plans'
      },{
        path: 'test-plans',
        component: TestPlansComponent,
        data: {breadcrumb: 'Test Plans'}
      },{
        path: 'new-test-plan',
        component: NewTestPlanComponent,
        data: {breadcrumb: 'Create Test Plan'}
      }
    ]
  },{
    path: 'test-suites',
    component: TestSuitesComponent,
    data: {breadcrumb: 'Test Suites'}
  },{
    path: 'test-run-results',
    data: {breadcrumb: 'Test Run Results'},
    children: [
      {
        path: '',
        component: TestRunResultsComponent,
        data: {breadcrumb: 'Test Run Results'}
      },{
        path: 'test-run-result',
        component: TestRunResultComponent,
        data: {breadcrumb: 'Test Run Result'}
      }
    ]
  },{
    path: 'test-run',
    component: TestRunComponent,
    data: {breadcrumb: 'Test Run'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestManagementRoutingModule { }
